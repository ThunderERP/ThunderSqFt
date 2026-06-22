// src/modules/inventory/inventory.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PaginationDto, paginate } from '../../common/dto/pagination.dto';
import {
  AdjustStockDto,
  UpdateReorderLevelDto,
  ReserveStockDto,
  ReleaseStockDto,
  DeductStockDto,
  AddStockDto,
} from './dto/inventory.dto';

@Injectable()
export class InventoryService {
  constructor(private prisma: PrismaService) {}

  // ── Public queries ─────────────────────────────────────────────────────────

  async findAll(dto: PaginationDto) {
    const { page = 1, limit = 20 } = dto;
    const skip = (page - 1) * limit;
    const [data, total] = await this.prisma.$transaction([
      this.prisma.inventory.findMany({
        skip,
        take: limit,
        include: {
          product: {
            select: { id: true, name: true, category: true, unit: true, isActive: true },
          },
        },
        orderBy: { product: { name: 'asc' } },
      }),
      this.prisma.inventory.count(),
    ]);
    return paginate(data, total, page, limit);
  }

  async findOne(productId: number) {
    const inv = await this.prisma.inventory.findUnique({
      where: { productId },
      include: { product: true },
    });
    if (!inv) throw new NotFoundException(`Inventory for product #${productId} not found`);
    return inv;
  }

  async getLowStock() {
    // Delegate to the raw query version which does correct column comparison
    return this.getLowStockRaw();
  }

  async getLowStockRaw() {
    // Raw query for correct column comparison
    return this.prisma.$queryRaw<
      { product_id: number; product_name: string; available_qty: number; reorder_level: number }[]
    >`
      SELECT i.product_id, p.name AS product_name,
             i.available_qty, i.reserved_qty, i.reorder_level
      FROM inventory i
      JOIN products p ON p.id = i.product_id
      WHERE p.is_active = true
        AND i.available_qty <= i.reorder_level
      ORDER BY (i.available_qty - i.reorder_level) ASC
    `;
  }

  async getMovements(productId: number, dto: PaginationDto) {
    const { page = 1, limit = 20 } = dto;
    const skip = (page - 1) * limit;
    const where = { productId };
    const [data, total] = await this.prisma.$transaction([
      this.prisma.stockMovement.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          product: { select: { id: true, name: true, unit: true } },
        },
      }),
      this.prisma.stockMovement.count({ where }),
    ]);
    return paginate(data, total, page, limit);
  }

  async updateReorderLevel(productId: number, dto: UpdateReorderLevelDto) {
    await this.findOne(productId);
    return this.prisma.inventory.update({
      where: { productId },
      data: { reorderLevel: dto.reorderLevel },
      include: { product: { select: { id: true, name: true } } },
    });
  }

  // ── Manual stock adjustment ────────────────────────────────────────────────

  async adjustStock(productId: number, dto: AdjustStockDto, userId: number) {
    if (dto.quantity === 0) throw new BadRequestException('Adjustment quantity cannot be zero');

    return this.prisma.$transaction(async (tx) => {
      // Lock inventory row (SELECT FOR UPDATE — same pattern as Sequence Diagram)
      const rows = await tx.$queryRaw<{ available_qty: number }[]>`
        SELECT available_qty FROM inventory
        WHERE product_id = ${productId}
        FOR UPDATE
      `;
      if (!rows.length) throw new NotFoundException(`Inventory for product #${productId} not found`);

      const current = rows[0].available_qty;
      const newQty = current + dto.quantity;
      if (newQty < 0) {
        throw new BadRequestException(
          `Adjustment would make stock negative. Current: ${current}, Adjustment: ${dto.quantity}`,
        );
      }

      await tx.inventory.update({
        where: { productId },
        data: { availableQty: newQty },
      });

      await tx.stockMovement.create({
        data: {
          productId,
          type: 'ADJUSTMENT',
          quantity: Math.abs(dto.quantity),
          referenceType: 'ADJUSTMENT',
          referenceId: productId,
          note: `Manual adjustment (${dto.quantity > 0 ? '+' : ''}${dto.quantity}): ${dto.note}`,
          createdBy: userId,
        },
      });

      return tx.inventory.findUnique({
        where: { productId },
        include: { product: { select: { id: true, name: true, unit: true } } },
      });
    });
  }

  // ── Internal atomic operations (called by Orders / Purchases services) ─────

  /**
   * ATOMIC RESERVE — Step 4–10 from Sequence Diagram.
   * Uses SELECT FOR UPDATE to lock the row, checks availability,
   * then moves qty from available → reserved.
   * Must be called inside an existing $transaction.
   */
  async atomicReserve(
    tx: Parameters<Parameters<PrismaService['$transaction']>[0]>[0],
    dto: ReserveStockDto,
  ): Promise<void> {
    // Step 5: SELECT FOR UPDATE — lock the inventory row
    const rows = await tx.$queryRaw<
      { available_qty: number; reserved_qty: number }[]
    >`
      SELECT available_qty, reserved_qty
      FROM inventory
      WHERE product_id = ${dto.productId}
      FOR UPDATE
    `;

    if (!rows.length) {
      throw new NotFoundException(`No inventory record for product #${dto.productId}`);
    }

    const { available_qty } = rows[0];

    // Step 6: Return current stock levels → check
    if (available_qty < dto.quantity) {
      // Step 11: Error: Insufficient Stock → Step 12: Notify "Out of Stock"
      throw new ConflictException(
        `Insufficient stock for product #${dto.productId}. ` +
          `Available: ${available_qty}, Requested: ${dto.quantity}`,
      );
    }

    // Step 7: Update reserved_quantity (+Qty)
    // Step 8: Update available_quantity (-Qty)
    await tx.$executeRaw`
      UPDATE inventory
      SET available_qty = available_qty - ${dto.quantity},
          reserved_qty  = reserved_qty  + ${dto.quantity}
      WHERE product_id = ${dto.productId}
    `;

    // Record stock movement
    await tx.stockMovement.create({
      data: {
        productId: dto.productId,
        type: 'RESERVATION',
        quantity: dto.quantity,
        referenceType: dto.referenceType,
        referenceId: dto.referenceId,
        note: `Stock reserved for ${dto.referenceType} #${dto.referenceId}`,
        createdBy: dto.userId,
      },
    });
  }

  /**
   * ATOMIC RELEASE — Releases reserved stock back to available.
   * Used when an order is cancelled before shipping.
   * Must be called inside an existing $transaction.
   */
  async atomicRelease(
    tx: Parameters<Parameters<PrismaService['$transaction']>[0]>[0],
    dto: ReleaseStockDto,
  ): Promise<void> {
    await tx.$executeRaw`
      UPDATE inventory
      SET available_qty = available_qty + ${dto.quantity},
          reserved_qty  = reserved_qty  - ${dto.quantity}
      WHERE product_id = ${dto.productId}
        AND reserved_qty >= ${dto.quantity}
    `;

    await tx.stockMovement.create({
      data: {
        productId: dto.productId,
        type: 'RESERVATION_RELEASE',
        quantity: dto.quantity,
        referenceType: dto.referenceType,
        referenceId: dto.referenceId,
        note: `Reservation released for cancelled ${dto.referenceType} #${dto.referenceId}`,
        createdBy: dto.userId,
      },
    });
  }

  /**
   * ATOMIC DEDUCT — On delivery: removes from reserved (stock physically leaves).
   * Must be called inside an existing $transaction.
   */
  async atomicDeduct(
    tx: Parameters<Parameters<PrismaService['$transaction']>[0]>[0],
    dto: DeductStockDto,
  ): Promise<void> {
    const rows = await tx.$queryRaw<{ reserved_qty: number }[]>`
      SELECT reserved_qty FROM inventory
      WHERE product_id = ${dto.productId}
      FOR UPDATE
    `;
    if (!rows.length || rows[0].reserved_qty < dto.quantity) {
      throw new BadRequestException(
        `Cannot deduct: reserved qty insufficient for product #${dto.productId}`,
      );
    }

    await tx.$executeRaw`
      UPDATE inventory
      SET reserved_qty = reserved_qty - ${dto.quantity}
      WHERE product_id = ${dto.productId}
    `;

    await tx.stockMovement.create({
      data: {
        productId: dto.productId,
        type: 'OUTWARD',
        quantity: dto.quantity,
        referenceType: dto.referenceType,
        referenceId: dto.referenceId,
        note: `Stock deducted on delivery for ${dto.referenceType} #${dto.referenceId}`,
        createdBy: dto.userId,
      },
    });
  }

  /**
   * ATOMIC ADD — On goods receipt: increases available_qty (inward movement).
   * Must be called inside an existing $transaction.
   */
  async atomicAdd(
    tx: Parameters<Parameters<PrismaService['$transaction']>[0]>[0],
    dto: AddStockDto,
  ): Promise<void> {
    await tx.$executeRaw`
      UPDATE inventory
      SET available_qty = available_qty + ${dto.quantity}
      WHERE product_id = ${dto.productId}
    `;

    await tx.stockMovement.create({
      data: {
        productId: dto.productId,
        type: 'INWARD',
        quantity: dto.quantity,
        referenceType: dto.referenceType,
        referenceId: dto.referenceId,
        note: `Stock received for ${dto.referenceType} #${dto.referenceId}`,
        createdBy: dto.userId,
      },
    });
  }
}
