// src/modules/purchases/purchases.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { InventoryService } from '../inventory/inventory.service';
import { CreatePurchaseDto } from './dto/purchase.dto';
import { PaginationDto, paginate } from '../../common/dto/pagination.dto';
import { PurchaseStatus, Role } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

// SRS 5: Purchase state machine
// Pending → Approved → Received → Completed
const VALID_PURCHASE_TRANSITIONS: Record<PurchaseStatus, PurchaseStatus[]> = {
  PENDING: [PurchaseStatus.APPROVED],
  APPROVED: [PurchaseStatus.RECEIVED],
  RECEIVED: [PurchaseStatus.COMPLETED],
  COMPLETED: [],
};

const PURCHASE_INCLUDE = {
  supplier: { select: { id: true, name: true, email: true } },
  items: {
    include: {
      product: { select: { id: true, name: true, unit: true } },
    },
  },
};

@Injectable()
export class PurchasesService {
  constructor(
    private prisma: PrismaService,
    private inventorySvc: InventoryService,
  ) {}

  // SRS 4.2: Supplier must exist before creating a purchase
  async create(dto: CreatePurchaseDto, userId: number) {
    const supplier = await this.prisma.supplier.findUnique({
      where: { id: dto.supplierId },
    });
    if (!supplier || !supplier.isActive) {
      throw new NotFoundException(`Supplier #${dto.supplierId} not found`);
    }

    // Validate all products exist
    const productIds = dto.items.map((i) => i.productId);
    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds }, isActive: true },
    });
    if (products.length !== productIds.length) {
      throw new BadRequestException('One or more products not found or inactive');
    }

    // Calculate totals
    let total = new Decimal(0);
    const itemsData = dto.items.map((item) => {
      const lineTotal = new Decimal(item.unitPrice).mul(item.quantity);
      total = total.add(lineTotal);
      return {
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        lineTotal,
      };
    });

    const purchase = await this.prisma.purchase.create({
      data: {
        supplierId: dto.supplierId,
        expectedDeliveryDate: dto.expectedDeliveryDate ? new Date(dto.expectedDeliveryDate) : null,
        status: PurchaseStatus.PENDING,
        totalAmount: total,
        notes: dto.notes,
        createdBy: userId,
        items: { create: itemsData },
      },
      include: PURCHASE_INCLUDE,
    });

    return purchase;
  }

  // SRS 4.2: Purchases must be approved by Business Owner before goods receipt
  async approve(purchaseId: number, userId: number, userRole: Role) {
    if (userRole !== Role.BUSINESS_OWNER && userRole !== Role.DEVELOPER_ADMIN) {
      throw new ForbiddenException('Only Business Owner can approve purchases');
    }

    const purchase = await this.prisma.purchase.findUnique({
      where: { id: purchaseId },
    });
    if (!purchase) throw new NotFoundException(`Purchase #${purchaseId} not found`);
    if (purchase.status !== PurchaseStatus.PENDING) {
      throw new UnprocessableEntityException(
        `Purchase is in ${purchase.status} state, cannot approve`,
      );
    }

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.purchase.update({
        where: { id: purchaseId },
        data: {
          status: PurchaseStatus.APPROVED,
          approvedBy: userId,
          approvedAt: new Date(),
        },
        include: PURCHASE_INCLUDE,
      });

      await tx.auditLog.create({
        data: {
          userId,
          action: 'PURCHASE_APPROVED',
          entityType: 'Purchase',
          entityId: purchaseId,
          oldValue: { status: 'PENDING' },
          newValue: { status: 'APPROVED', approvedBy: userId },
        },
      });

      return updated;
    });
  }

  // SRS 4.2: Goods receipt increases available_quantity + creates Inward stock movement
  async receiveGoods(purchaseId: number, userId: number) {
    return this.prisma.$transaction(
      async (tx) => {
        const purchase = await tx.purchase.findUnique({
          where: { id: purchaseId },
          include: { items: true },
        });
        if (!purchase) throw new NotFoundException(`Purchase #${purchaseId} not found`);
        if (purchase.status !== PurchaseStatus.APPROVED) {
          throw new UnprocessableEntityException(
            `Purchase must be APPROVED before goods receipt. Current: ${purchase.status}`,
          );
        }

        // Add stock for each item (Inward movement)
        for (const item of purchase.items) {
          await this.inventorySvc.atomicAdd(tx, {
            productId: item.productId,
            quantity: item.quantity,
            referenceId: purchaseId,
            referenceType: 'PURCHASE',
            userId,
          });
        }

        const updated = await tx.purchase.update({
          where: { id: purchaseId },
          data: { status: PurchaseStatus.RECEIVED },
          include: PURCHASE_INCLUDE,
        });

        await tx.auditLog.create({
          data: {
            userId,
            action: 'PURCHASE_GOODS_RECEIVED',
            entityType: 'Purchase',
            entityId: purchaseId,
            newValue: { status: 'RECEIVED', itemCount: purchase.items.length },
          },
        });

        return updated;
      },
      { timeout: 15000 },
    );
  }

  async complete(purchaseId: number, userId: number) {
    const purchase = await this.prisma.purchase.findUnique({ where: { id: purchaseId } });
    if (!purchase) throw new NotFoundException(`Purchase #${purchaseId} not found`);
    if (purchase.status !== PurchaseStatus.RECEIVED) {
      throw new UnprocessableEntityException(
        `Purchase must be RECEIVED before completing. Current: ${purchase.status}`,
      );
    }

    return this.prisma.purchase.update({
      where: { id: purchaseId },
      data: { status: PurchaseStatus.COMPLETED },
      include: PURCHASE_INCLUDE,
    });
  }

  async findAll(dto: PaginationDto, status?: PurchaseStatus) {
    const { page = 1, limit = 20 } = dto;
    const skip = (page - 1) * limit;
    const where = {
      isActive: true,
      ...(status && { status }),
    };
    const [data, total] = await this.prisma.$transaction([
      this.prisma.purchase.findMany({
        where,
        skip,
        take: limit,
        orderBy: { purchaseDate: 'desc' },
        include: {
          supplier: { select: { id: true, name: true } },
          _count: { select: { items: true } },
        },
      }),
      this.prisma.purchase.count({ where }),
    ]);
    return paginate(data, total, page, limit);
  }

  async findOne(id: number) {
    const p = await this.prisma.purchase.findUnique({
      where: { id },
      include: PURCHASE_INCLUDE,
    });
    if (!p) throw new NotFoundException(`Purchase #${id} not found`);
    return p;
  }
}
