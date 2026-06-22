// src/modules/returns/returns.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  UnprocessableEntityException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { InventoryService } from '../inventory/inventory.service';
import { CreateReturnDto, ProcessReturnDto } from './dto/return.dto';
import { PaginationDto, paginate } from '../../common/dto/pagination.dto';
import { OrderStatus, ReturnStatus, ReturnType } from '@prisma/client';

// SRS 5: Return state machine — Requested → Approved|Rejected → Completed
const RETURN_INCLUDE = {
  order: { select: { id: true, status: true, customerId: true } },
  invoice: { select: { id: true, status: true, totalAmount: true } },
  product: { select: { id: true, name: true, unit: true } },
};

@Injectable()
export class ReturnsService {
  constructor(
    private prisma: PrismaService,
    private inventorySvc: InventoryService,
  ) {}

  // SRS 4.4: Returns only for DELIVERED orders, must include a reason
  async create(dto: CreateReturnDto, userId: number) {
    // Validate order is delivered
    const order = await this.prisma.order.findUnique({
      where: { id: dto.orderId },
      include: {
        items: { where: { productId: dto.productId } },
        invoice: true,
      },
    });

    if (!order) throw new NotFoundException(`Order #${dto.orderId} not found`);

    if (order.status !== OrderStatus.DELIVERED && order.status !== OrderStatus.COMPLETED) {
      throw new UnprocessableEntityException(
        `Returns only allowed for DELIVERED or COMPLETED orders. Current: ${order.status}`,
      );
    }

    if (!order.invoice) {
      throw new UnprocessableEntityException('No invoice found for this order');
    }

    // Validate the product was part of this order
    if (!order.items.length) {
      throw new BadRequestException(
        `Product #${dto.productId} was not in order #${dto.orderId}`,
      );
    }

    const orderedQty = order.items[0].quantity;
    if (dto.quantity > orderedQty) {
      throw new BadRequestException(
        `Return quantity (${dto.quantity}) exceeds ordered quantity (${orderedQty})`,
      );
    }

    // Check no existing active return for same order + product
    const existingReturn = await this.prisma.return.findFirst({
      where: {
        orderId: dto.orderId,
        productId: dto.productId,
        status: { notIn: [ReturnStatus.REJECTED] },
      },
    });
    if (existingReturn) {
      throw new ConflictException(
        `An active return already exists for this product in order #${dto.orderId}`,
      );
    }

    const ret = await this.prisma.$transaction(async (tx) => {
      const created = await tx.return.create({
        data: {
          orderId: dto.orderId,
          invoiceId: order.invoice!.id,
          productId: dto.productId,
          quantity: dto.quantity,
          type: dto.type,
          reason: dto.reason,
          status: ReturnStatus.REQUESTED,
          createdBy: userId,
        },
        include: RETURN_INCLUDE,
      });

      await tx.auditLog.create({
        data: {
          userId,
          action: 'RETURN_REQUESTED',
          entityType: 'Return',
          entityId: created.id,
          newValue: {
            orderId: dto.orderId,
            productId: dto.productId,
            quantity: dto.quantity,
            type: dto.type,
            reason: dto.reason,
          },
        },
      });

      return created;
    });

    return ret;
  }

  // SRS 4.4: REFUND → Finance impact; RETURN → Inventory impact; REPLACEMENT → Outward
  async process(returnId: number, dto: ProcessReturnDto, userId: number) {
    return this.prisma.$transaction(
      async (tx) => {
        const ret = await tx.return.findUnique({
          where: { id: returnId },
          include: { order: true, invoice: true },
        });
        if (!ret) throw new NotFoundException(`Return #${returnId} not found`);
        if (ret.status !== ReturnStatus.REQUESTED) {
          throw new UnprocessableEntityException(
            `Return is already ${ret.status}`,
          );
        }

        const isApproved = dto.status === ReturnStatus.APPROVED;

        // Handle approved returns based on type
        if (isApproved) {
          if (ret.type === ReturnType.RETURN) {
            // Inventory impact — stock comes back
            await this.inventorySvc.atomicAdd(tx, {
              productId: ret.productId,
              quantity: ret.quantity,
              referenceId: returnId,
              referenceType: 'RETURN',
              userId,
            });
          }

          if (ret.type === ReturnType.REPLACEMENT) {
            // Outward movement — replacement sent out
            await this.inventorySvc.atomicDeduct(tx, {
              productId: ret.productId,
              quantity: ret.quantity,
              referenceId: returnId,
              referenceType: 'RETURN',
              userId,
            });
          }

          if (ret.type === ReturnType.REFUND) {
            // Finance impact — create a credit transaction
            if (!dto.refundAmount) {
              throw new BadRequestException('Refund amount is required for REFUND type');
            }
            await tx.auditLog.create({
              data: {
                userId,
                action: 'REFUND_ISSUED',
                entityType: 'Return',
                entityId: returnId,
                newValue: {
                  refundAmount: dto.refundAmount,
                  invoiceId: ret.invoiceId,
                },
              },
            });
          }

          // Mark order as returned if approved full return
          await tx.order.update({
            where: { id: ret.orderId },
            data: { status: OrderStatus.RETURNED, updatedBy: userId },
          });
        }

        const updated = await tx.return.update({
          where: { id: returnId },
          data: {
            status: isApproved ? ReturnStatus.COMPLETED : ReturnStatus.REJECTED,
            refundAmt: dto.refundAmount ?? null,
            resolvedAt: new Date(),
            resolvedBy: userId,
          },
          include: RETURN_INCLUDE,
        });

        await tx.auditLog.create({
          data: {
            userId,
            action: isApproved ? 'RETURN_APPROVED' : 'RETURN_REJECTED',
            entityType: 'Return',
            entityId: returnId,
            oldValue: { status: 'REQUESTED' },
            newValue: { status: updated.status, notes: dto.notes },
          },
        });

        return updated;
      },
      { timeout: 15000 },
    );
  }

  async findAll(dto: PaginationDto, status?: ReturnStatus) {
    const { page = 1, limit = 20 } = dto;
    const skip = (page - 1) * limit;
    const where = { ...(status && { status }) };
    const [data, total] = await this.prisma.$transaction([
      this.prisma.return.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: RETURN_INCLUDE,
      }),
      this.prisma.return.count({ where }),
    ]);
    return paginate(data, total, page, limit);
  }

  async findOne(id: number) {
    const r = await this.prisma.return.findUnique({
      where: { id },
      include: RETURN_INCLUDE,
    });
    if (!r) throw new NotFoundException(`Return #${id} not found`);
    return r;
  }
}

