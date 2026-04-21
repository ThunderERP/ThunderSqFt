// src/modules/orders/orders.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { InventoryService } from '../inventory/inventory.service';
import { CreateOrderDto, UpdateOrderStatusDto, OrderFilterDto } from './dto/order.dto';
import { PaginationDto, paginate } from '../../common/dto/pagination.dto';
import { OrderStatus } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

// ── State machine from SRS Section 5 ──────────────────────────────────────────
// Pending → Confirmed → Shipped → Delivered → Completed
//                     ↘ Cancelled (from Pending or Confirmed only)
//                                           ↘ Returned (from Delivered only)
const VALID_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  PENDING: [OrderStatus.CONFIRMED, OrderStatus.CANCELLED],
  CONFIRMED: [OrderStatus.SHIPPED, OrderStatus.CANCELLED],
  SHIPPED: [OrderStatus.DELIVERED],
  DELIVERED: [OrderStatus.COMPLETED, OrderStatus.RETURNED],
  COMPLETED: [],
  CANCELLED: [],
  RETURNED: [],
};

const ORDER_INCLUDE = {
  customer: { select: { id: true, name: true, phone: true } },
  items: {
    include: {
      product: { select: { id: true, name: true, unit: true } },
    },
  },
  invoice: { select: { id: true, status: true, totalAmount: true } },
  tracking: true,
};

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private inventorySvc: InventoryService,
  ) {}

  // ── Create (Step 1: Sales Staff creates order — status = PENDING) ──────────

  async create(dto: CreateOrderDto, userId: number) {
    // Validate customer exists
    const customer = await this.prisma.customer.findUnique({
      where: { id: dto.customerId },
    });
    if (!customer || !customer.isActive) {
      throw new NotFoundException(`Customer #${dto.customerId} not found`);
    }

    // Fetch all products and validate
    const productIds = dto.items.map((i) => i.productId);
    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds }, isActive: true },
    });
    if (products.length !== productIds.length) {
      throw new BadRequestException('One or more products not found or inactive');
    }
    const productMap = new Map(products.map((p) => [p.id, p]));

    // Calculate totals per SRS 4.3:
    // Total = Price × Qty; discount applied before tax; tax on discounted amount
    let orderTotal = new Decimal(0);
    const itemsData = dto.items.map((item) => {
      const product = productMap.get(item.productId)!;
      const baseAmount = new Decimal(product.price).mul(item.quantity);
      const discountAmt = baseAmount.mul(product.discountPercentage).div(100);
      const discountedAmount = baseAmount.sub(discountAmt);
      const taxAmount = discountedAmount.mul(product.gstPercentage).div(100);
      const lineTotal = discountedAmount.add(taxAmount);
      orderTotal = orderTotal.add(lineTotal);
      return {
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: product.price,
        gstPct: product.gstPercentage,
        discountPct: product.discountPercentage,
        lineTotal,
      };
    });

    // Create order with PENDING status — no stock reservation yet
    const order = await this.prisma.order.create({
      data: {
        customerId: dto.customerId,
        status: OrderStatus.PENDING,
        totalAmount: orderTotal,
        notes: dto.notes,
        createdBy: userId,
        items: { create: itemsData },
      },
      include: ORDER_INCLUDE,
    });

    return order;
  }

  // ── Confirm order — THE ATOMIC STOCK RESERVATION (Sequence Diagram Steps 2–16)

  async confirm(orderId: number, userId: number) {
    return this.prisma.$transaction(
      async (tx) => {
        // Step 2: Validate Permissions — done at controller level (RBAC)
        // Step 3: Authorized → proceed

        // Fetch order and lock it
        const order = await tx.order.findUnique({
          where: { id: orderId },
          include: { items: true },
        });
        if (!order) throw new NotFoundException(`Order #${orderId} not found`);
        if (order.status !== OrderStatus.PENDING) {
          throw new UnprocessableEntityException(`Cannot confirm order in status: ${order.status}`);
        }

        // Steps 4–10: Atomic stock reservation for each item
        // InventoryService.atomicReserve uses SELECT FOR UPDATE internally
        for (const item of order.items) {
          await this.inventorySvc.atomicReserve(tx, {
            productId: item.productId,
            quantity: item.quantity,
            referenceId: orderId,
            referenceType: 'ORDER',
            userId,
          });
        }

        // Step 13: Save Order (Status: Confirmed)
        const confirmed = await tx.order.update({
          where: { id: orderId },
          data: {
            status: OrderStatus.CONFIRMED,
            updatedBy: userId,
          },
          include: ORDER_INCLUDE,
        });

        // Step 14: Trigger Invoice Generation
        // Step 15: Create Invoice Record
        const taxAmount = confirmed.items.reduce((sum, item) => {
          const discounted = new Decimal(item.unitPrice)
            .mul(item.quantity)
            .mul(new Decimal(1).sub(new Decimal(item.discountPct).div(100)));
          return sum.add(discounted.mul(new Decimal(item.gstPct).div(100)));
        }, new Decimal(0));

        await tx.invoice.create({
          data: {
            orderId,
            taxAmount,
            totalAmount: confirmed.totalAmount,
            status: 'PENDING',
          },
        });

        // Audit log
        await tx.auditLog.create({
          data: {
            userId,
            action: 'ORDER_CONFIRMED',
            entityType: 'Order',
            entityId: orderId,
            oldValue: { status: 'PENDING' },
            newValue: { status: 'CONFIRMED' },
          },
        });

        return confirmed;
      },
      { timeout: 15000 },
    );
    // Step 16: Order Confirmed & Invoice Ready → returned to caller
  }

  // ── Ship order ────────────────────────────────────────────────────────────

  async ship(orderId: number, address: string, userId: number) {
    return this.prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({ where: { id: orderId } });
      if (!order) throw new NotFoundException(`Order #${orderId} not found`);
      this.assertTransition(order.status, OrderStatus.SHIPPED);

      await tx.order.update({
        where: { id: orderId },
        data: { status: OrderStatus.SHIPPED, updatedBy: userId },
      });

      // Create or update tracking record
      await tx.tracking.upsert({
        where: { orderId },
        create: { orderId, status: 'IN_TRANSIT', address },
        update: { status: 'IN_TRANSIT', address, trackingDate: new Date() },
      });

      await tx.auditLog.create({
        data: {
          userId,
          action: 'ORDER_SHIPPED',
          entityType: 'Order',
          entityId: orderId,
          newValue: { status: 'SHIPPED', address },
        },
      });

      return tx.order.findUnique({ where: { id: orderId }, include: ORDER_INCLUDE });
    });
  }

  // ── Deliver order — deducts from reserved stock ───────────────────────────

  async deliver(orderId: number, userId: number) {
    return this.prisma.$transaction(
      async (tx) => {
        const order = await tx.order.findUnique({
          where: { id: orderId },
          include: { items: true },
        });
        if (!order) throw new NotFoundException(`Order #${orderId} not found`);
        this.assertTransition(order.status, OrderStatus.DELIVERED);

        // Deduct from reserved stock (physical outward movement)
        for (const item of order.items) {
          await this.inventorySvc.atomicDeduct(tx, {
            productId: item.productId,
            quantity: item.quantity,
            referenceId: orderId,
            referenceType: 'ORDER',
            userId,
          });
        }

        await tx.order.update({
          where: { id: orderId },
          data: { status: OrderStatus.DELIVERED, updatedBy: userId },
        });

        await tx.tracking.upsert({
          where: { orderId },
          create: { orderId, status: 'DELIVERED', trackingDate: new Date() },
          update: { status: 'DELIVERED', trackingDate: new Date() },
        });

        await tx.auditLog.create({
          data: {
            userId,
            action: 'ORDER_DELIVERED',
            entityType: 'Order',
            entityId: orderId,
            newValue: { status: 'DELIVERED' },
          },
        });

        return tx.order.findUnique({ where: { id: orderId }, include: ORDER_INCLUDE });
      },
      { timeout: 15000 },
    );
  }

  // ── Complete order ────────────────────────────────────────────────────────

  async complete(orderId: number, userId: number) {
    return this.prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({ where: { id: orderId } });
      if (!order) throw new NotFoundException(`Order #${orderId} not found`);
      this.assertTransition(order.status, OrderStatus.COMPLETED);

      await tx.order.update({
        where: { id: orderId },
        data: { status: OrderStatus.COMPLETED, updatedBy: userId },
      });

      await tx.auditLog.create({
        data: {
          userId,
          action: 'ORDER_COMPLETED',
          entityType: 'Order',
          entityId: orderId,
          newValue: { status: 'COMPLETED' },
        },
      });

      return tx.order.findUnique({ where: { id: orderId }, include: ORDER_INCLUDE });
    });
  }

  // ── Cancel order — releases reserved stock ────────────────────────────────

  async cancel(orderId: number, reason: string, userId: number) {
    return this.prisma.$transaction(
      async (tx) => {
        const order = await tx.order.findUnique({
          where: { id: orderId },
          include: { items: true },
        });
        if (!order) throw new NotFoundException(`Order #${orderId} not found`);
        this.assertTransition(order.status, OrderStatus.CANCELLED);

        // Release stock only if it was confirmed (reserved)
        if (order.status === OrderStatus.CONFIRMED) {
          for (const item of order.items) {
            await this.inventorySvc.atomicRelease(tx, {
              productId: item.productId,
              quantity: item.quantity,
              referenceId: orderId,
              referenceType: 'ORDER',
              userId,
            });
          }
        }

        // Void invoice if exists
        await tx.invoice
          .update({
            where: { orderId },
            data: { status: 'FAILED' },
          })
          .catch(() => null); // Invoice may not exist yet for PENDING orders

        await tx.order.update({
          where: { id: orderId },
          data: {
            status: OrderStatus.CANCELLED,
            notes: reason,
            updatedBy: userId,
          },
        });

        await tx.auditLog.create({
          data: {
            userId,
            action: 'ORDER_CANCELLED',
            entityType: 'Order',
            entityId: orderId,
            oldValue: { status: order.status },
            newValue: { status: 'CANCELLED', reason },
          },
        });

        return tx.order.findUnique({ where: { id: orderId }, include: ORDER_INCLUDE });
      },
      { timeout: 15000 },
    );
  }

  // ── Queries ───────────────────────────────────────────────────────────────

  async findAll(dto: PaginationDto, filter: OrderFilterDto) {
    const { page = 1, limit = 20 } = dto;
    const skip = (page - 1) * limit;
    const where = {
      isActive: true,
      ...(filter.status && { status: filter.status }),
      ...(filter.customerId && { customerId: filter.customerId }),
    };
    const [data, total] = await this.prisma.$transaction([
      this.prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: { orderDate: 'desc' },
        include: {
          customer: { select: { id: true, name: true, phone: true } },
          _count: { select: { items: true } },
          invoice: { select: { id: true, status: true } },
        },
      }),
      this.prisma.order.count({ where }),
    ]);
    return paginate(data, total, page, limit);
  }

  async findOne(id: number) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: ORDER_INCLUDE,
    });
    if (!order) throw new NotFoundException(`Order #${id} not found`);
    return order;
  }

  // ── State machine guard ───────────────────────────────────────────────────

  private assertTransition(current: OrderStatus, next: OrderStatus) {
    const allowed = VALID_TRANSITIONS[current];
    if (!allowed.includes(next)) {
      throw new UnprocessableEntityException(
        `Invalid transition: ${current} → ${next}. Allowed: ${allowed.join(', ') || 'none'}`,
      );
    }
  }
}
