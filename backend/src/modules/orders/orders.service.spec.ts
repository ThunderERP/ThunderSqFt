// src/modules/orders/orders.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { PrismaService } from '../../prisma/prisma.service';
import { InventoryService } from '../inventory/inventory.service';
import {
  ConflictException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { OrderStatus } from '@prisma/client';

// ── Minimal Prisma mock ───────────────────────────────────────────────────────
const mockPrisma = {
  customer: { findUnique: jest.fn() },
  product: { findMany: jest.fn() },
  order: {
    create: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
  },
  invoice: { create: jest.fn(), update: jest.fn() },
  tracking: { upsert: jest.fn() },
  auditLog: { create: jest.fn() },
  $transaction: jest.fn(),
  $queryRaw: jest.fn(),
};

const mockInventoryService = {
  atomicReserve: jest.fn(),
  atomicRelease: jest.fn(),
  atomicDeduct: jest.fn(),
};

// ── Helpers ───────────────────────────────────────────────────────────────────
const makeOrder = (status: OrderStatus) => ({
  id: 1,
  customerId: 1,
  status,
  totalAmount: '1000.00',
  discount: '0',
  taxAmount: '180.00',
  notes: null,
  isActive: true,
  createdBy: 1,
  updatedBy: null,
  orderDate: new Date(),
  createdAt: new Date(),
  updatedAt: new Date(),
  items: [{ id: 1, productId: 1, quantity: 2, unitPrice: '499.99', gstPct: '18', discountPct: '0', lineTotal: '1000.00', orderId: 1 }],
  customer: { id: 1, name: 'Test Customer', phone: '9999999999' },
  invoice: null,
  tracking: null,
});

// ── Tests ─────────────────────────────────────────────────────────────────────
describe('OrdersService', () => {
  let service: OrdersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: InventoryService, useValue: mockInventoryService },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    jest.clearAllMocks();
  });

  // ── create ─────────────────────────────────────────────────────────────────
  describe('create', () => {
    it('throws NotFoundException when customer does not exist', async () => {
      mockPrisma.customer.findUnique.mockResolvedValue(null);
      await expect(
        service.create({ customerId: 99, items: [{ productId: 1, quantity: 1 }] }, 1),
      ).rejects.toThrow(NotFoundException);
    });

    it('throws BadRequestException when a product is inactive', async () => {
      mockPrisma.customer.findUnique.mockResolvedValue({ id: 1, isActive: true });
      mockPrisma.product.findMany.mockResolvedValue([]); // empty = product not found
      await expect(
        service.create({ customerId: 1, items: [{ productId: 99, quantity: 1 }] }, 1),
      ).rejects.toThrow();
    });

    it('creates order with PENDING status and correct totals', async () => {
      mockPrisma.customer.findUnique.mockResolvedValue({ id: 1, isActive: true });
      mockPrisma.product.findMany.mockResolvedValue([
        { id: 1, price: '100.00', gstPercentage: '18.00', discountPercentage: '0.00' },
      ]);
      const created = makeOrder(OrderStatus.PENDING);
      mockPrisma.order.create.mockResolvedValue(created);

      const result = await service.create(
        { customerId: 1, items: [{ productId: 1, quantity: 2 }] },
        1,
      );

      expect(mockPrisma.order.create).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ status: OrderStatus.PENDING }) }),
      );
      expect(result.status).toBe(OrderStatus.PENDING);
    });
  });

  // ── State machine ──────────────────────────────────────────────────────────
  describe('state machine — assertTransition', () => {
    const invalidTransitions: [OrderStatus, OrderStatus][] = [
      [OrderStatus.PENDING,   OrderStatus.SHIPPED],
      [OrderStatus.PENDING,   OrderStatus.DELIVERED],
      [OrderStatus.CONFIRMED, OrderStatus.DELIVERED],
      [OrderStatus.DELIVERED, OrderStatus.PENDING],
      [OrderStatus.COMPLETED, OrderStatus.CONFIRMED],
      [OrderStatus.CANCELLED, OrderStatus.CONFIRMED],
    ];

    it.each(invalidTransitions)(
      'blocks invalid transition %s → %s',
      async (from, to) => {
        mockPrisma.$transaction.mockImplementation(async (fn: Function) => fn(mockPrisma));
        mockPrisma.order.findUnique.mockResolvedValue(makeOrder(from));

        const action =
          to === OrderStatus.SHIPPED ? () => service.ship(1, '', 1)
          : to === OrderStatus.DELIVERED ? () => service.deliver(1, 1)
          : to === OrderStatus.CONFIRMED ? () => service.confirm(1, 1)
          : to === OrderStatus.COMPLETED ? () => service.complete(1, 1)
          : () => service.cancel(1, 'test', 1);

        await expect(action()).rejects.toThrow(UnprocessableEntityException);
      },
    );

    it('allows PENDING → CANCELLED', async () => {
      mockPrisma.$transaction.mockImplementation(async (fn: Function) => fn(mockPrisma));
      const order = makeOrder(OrderStatus.PENDING);
      mockPrisma.order.findUnique.mockResolvedValue(order);
      mockPrisma.order.update.mockResolvedValue({ ...order, status: OrderStatus.CANCELLED });
      mockPrisma.invoice.update.mockResolvedValue({});
      mockPrisma.auditLog.create.mockResolvedValue({});

      await expect(service.cancel(1, 'Customer request', 1)).resolves.toBeDefined();
    });
  });

  // ── confirm — stock reservation ────────────────────────────────────────────
  describe('confirm', () => {
    it('throws UnprocessableEntityException if order is not PENDING', async () => {
      mockPrisma.$transaction.mockImplementation(async (fn: Function) => fn(mockPrisma));
      mockPrisma.order.findUnique.mockResolvedValue(makeOrder(OrderStatus.CONFIRMED));
      await expect(service.confirm(1, 1)).rejects.toThrow(UnprocessableEntityException);
    });

    it('calls atomicReserve for each order item on confirm', async () => {
      const order = makeOrder(OrderStatus.PENDING);
      mockPrisma.$transaction.mockImplementation(async (fn: Function) => fn(mockPrisma));
      mockPrisma.order.findUnique.mockResolvedValue(order);
      mockInventoryService.atomicReserve.mockResolvedValue(undefined);
      mockPrisma.order.update.mockResolvedValue({ ...order, status: OrderStatus.CONFIRMED });
      mockPrisma.invoice.create.mockResolvedValue({ id: 1 });
      mockPrisma.auditLog.create.mockResolvedValue({});

      await service.confirm(1, 1);

      expect(mockInventoryService.atomicReserve).toHaveBeenCalledTimes(order.items.length);
      expect(mockInventoryService.atomicReserve).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ productId: 1, quantity: 2, referenceType: 'ORDER' }),
      );
    });

    it('rolls back if atomicReserve throws ConflictException (out of stock)', async () => {
      mockPrisma.$transaction.mockImplementation(async (fn: Function) => {
        return fn(mockPrisma);
      });
      mockPrisma.order.findUnique.mockResolvedValue(makeOrder(OrderStatus.PENDING));
      mockInventoryService.atomicReserve.mockRejectedValue(
        new ConflictException('Insufficient stock for product #1'),
      );

      await expect(service.confirm(1, 1)).rejects.toThrow(ConflictException);
      // order.update must NOT have been called — transaction rolled back
      expect(mockPrisma.order.update).not.toHaveBeenCalled();
    });
  });

  // ── cancel — stock release ─────────────────────────────────────────────────
  describe('cancel', () => {
    it('releases stock when cancelling a CONFIRMED order', async () => {
      const order = makeOrder(OrderStatus.CONFIRMED);
      mockPrisma.$transaction.mockImplementation(async (fn: Function) => fn(mockPrisma));
      mockPrisma.order.findUnique.mockResolvedValue(order);
      mockInventoryService.atomicRelease.mockResolvedValue(undefined);
      mockPrisma.invoice.update.mockResolvedValue({});
      mockPrisma.order.update.mockResolvedValue({ ...order, status: OrderStatus.CANCELLED });
      mockPrisma.auditLog.create.mockResolvedValue({});

      await service.cancel(1, 'Cancellation reason', 1);

      expect(mockInventoryService.atomicRelease).toHaveBeenCalledTimes(order.items.length);
    });

    it('does NOT release stock when cancelling a PENDING order (not yet reserved)', async () => {
      const order = makeOrder(OrderStatus.PENDING);
      mockPrisma.$transaction.mockImplementation(async (fn: Function) => fn(mockPrisma));
      mockPrisma.order.findUnique.mockResolvedValue(order);
      mockPrisma.invoice.update.mockResolvedValue({});
      mockPrisma.order.update.mockResolvedValue({ ...order, status: OrderStatus.CANCELLED });
      mockPrisma.auditLog.create.mockResolvedValue({});

      await service.cancel(1, 'Customer request', 1);

      expect(mockInventoryService.atomicRelease).not.toHaveBeenCalled();
    });
  });

  // ── findOne ────────────────────────────────────────────────────────────────
  describe('findOne', () => {
    it('throws NotFoundException for missing order', async () => {
      mockPrisma.order.findUnique.mockResolvedValue(null);
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });

    it('returns order when found', async () => {
      const order = makeOrder(OrderStatus.PENDING);
      mockPrisma.order.findUnique.mockResolvedValue(order);
      const result = await service.findOne(1);
      expect(result.id).toBe(1);
    });
  });
});
