// src/modules/returns/returns.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { ReturnsService } from './returns.service';
import { PrismaService } from '../../prisma/prisma.service';
import { InventoryService } from '../inventory/inventory.service';
import {
  NotFoundException,
  BadRequestException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { OrderStatus, ReturnStatus, ReturnType } from '@prisma/client';

const mockPrisma = {
  order: { findUnique: jest.fn(), update: jest.fn() },
  return: {
    create: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    findMany: jest.fn(),
    findFirst: jest.fn(),
    count: jest.fn(),
  },
  auditLog: { create: jest.fn() },
  $transaction: jest.fn(),
};
const mockInventorySvc = { atomicAdd: jest.fn(), atomicDeduct: jest.fn() };

const makeOrder = (status: OrderStatus) => ({
  id: 1,
  status,
  customerId: 1,
  isActive: true,
  createdBy: 1,
  invoice: { id: 1, totalAmount: '1000', paidAmount: '1000', status: 'PAID' },
  items: [
    {
      id: 1,
      productId: 1,
      quantity: 5,
      orderId: 1,
      unitPrice: '200',
      gstPct: '18',
      discountPct: '0',
      lineTotal: '1000',
    },
  ],
});

const makeReturn = (type: ReturnType) => ({
  id: 1,
  orderId: 1,
  invoiceId: 1,
  productId: 1,
  quantity: 2,
  type,
  status: ReturnStatus.REQUESTED,
  reason: 'Damaged',
  createdBy: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
  refundAmt: null,
  resolvedAt: null,
  resolvedBy: null,
  order: { id: 1, status: OrderStatus.DELIVERED, customerId: 1 },
  invoice: { id: 1, status: 'PAID', totalAmount: '1000' },
  product: { id: 1, name: 'Widget', unit: 'pcs' },
});

describe('ReturnsService', () => {
  let service: ReturnsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReturnsService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: InventoryService, useValue: mockInventorySvc },
      ],
    }).compile();
    service = module.get<ReturnsService>(ReturnsService);
    jest.clearAllMocks();
  });

  // ── create ─────────────────────────────────────────────────────────────────
  describe('create', () => {
    it('throws NotFoundException for missing order', async () => {
      mockPrisma.order.findUnique.mockResolvedValue(null);
      await expect(
        service.create(
          { orderId: 99, productId: 1, quantity: 1, type: ReturnType.REFUND, reason: 'broken' },
          1,
        ),
      ).rejects.toThrow(NotFoundException);
    });

    it('throws UnprocessableEntityException for non-DELIVERED order', async () => {
      mockPrisma.order.findUnique.mockResolvedValue(makeOrder(OrderStatus.CONFIRMED));
      await expect(
        service.create(
          { orderId: 1, productId: 1, quantity: 1, type: ReturnType.REFUND, reason: 'broken' },
          1,
        ),
      ).rejects.toThrow(UnprocessableEntityException);
    });

    it('throws BadRequestException if product was not in order', async () => {
      const order = { ...makeOrder(OrderStatus.DELIVERED), items: [] };
      mockPrisma.order.findUnique.mockResolvedValue(order);
      await expect(
        service.create(
          { orderId: 1, productId: 99, quantity: 1, type: ReturnType.REFUND, reason: 'broken' },
          1,
        ),
      ).rejects.toThrow(BadRequestException);
    });

    it('throws BadRequestException if return quantity exceeds ordered quantity', async () => {
      mockPrisma.order.findUnique.mockResolvedValue(makeOrder(OrderStatus.DELIVERED));
      mockPrisma.return.findFirst.mockResolvedValue(null);
      await expect(
        service.create(
          { orderId: 1, productId: 1, quantity: 99, type: ReturnType.REFUND, reason: 'broken' },
          1,
        ),
      ).rejects.toThrow(BadRequestException);
    });
  });

  // ── process ────────────────────────────────────────────────────────────────
  describe('process', () => {
    it('throws NotFoundException when return does not exist', async () => {
      mockPrisma.$transaction.mockImplementation(async (fn: Function) => fn(mockPrisma));
      mockPrisma.return.findUnique.mockResolvedValue(null);
      await expect(service.process(99, { status: ReturnStatus.APPROVED }, 1)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('throws UnprocessableEntityException if return is already processed', async () => {
      mockPrisma.$transaction.mockImplementation(async (fn: Function) => fn(mockPrisma));
      mockPrisma.return.findUnique.mockResolvedValue({
        ...makeReturn(ReturnType.REFUND),
        status: ReturnStatus.COMPLETED,
      });
      await expect(service.process(1, { status: ReturnStatus.APPROVED }, 1)).rejects.toThrow(
        UnprocessableEntityException,
      );
    });

    it('calls atomicAdd (stock restored) for RETURN type when approved', async () => {
      mockPrisma.$transaction.mockImplementation(async (fn: Function) => fn(mockPrisma));
      mockPrisma.return.findUnique.mockResolvedValue(makeReturn(ReturnType.RETURN));
      mockInventorySvc.atomicAdd.mockResolvedValue(undefined);
      mockPrisma.order.update.mockResolvedValue({});
      mockPrisma.return.update.mockResolvedValue({
        ...makeReturn(ReturnType.RETURN),
        status: ReturnStatus.COMPLETED,
      });
      mockPrisma.auditLog.create.mockResolvedValue({});

      await service.process(1, { status: ReturnStatus.APPROVED }, 1);

      expect(mockInventorySvc.atomicAdd).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ productId: 1, quantity: 2, referenceType: 'RETURN' }),
      );
    });

    it('calls atomicDeduct (stock sent) for REPLACEMENT type when approved', async () => {
      mockPrisma.$transaction.mockImplementation(async (fn: Function) => fn(mockPrisma));
      mockPrisma.return.findUnique.mockResolvedValue(makeReturn(ReturnType.REPLACEMENT));
      mockInventorySvc.atomicDeduct.mockResolvedValue(undefined);
      mockPrisma.order.update.mockResolvedValue({});
      mockPrisma.return.update.mockResolvedValue({
        ...makeReturn(ReturnType.REPLACEMENT),
        status: ReturnStatus.COMPLETED,
      });
      mockPrisma.auditLog.create.mockResolvedValue({});

      await service.process(1, { status: ReturnStatus.APPROVED }, 1);

      expect(mockInventorySvc.atomicDeduct).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ productId: 1, quantity: 2 }),
      );
    });

    it('requires refundAmount for REFUND type', async () => {
      mockPrisma.$transaction.mockImplementation(async (fn: Function) => fn(mockPrisma));
      mockPrisma.return.findUnique.mockResolvedValue(makeReturn(ReturnType.REFUND));
      mockPrisma.order.update.mockResolvedValue({});

      await expect(service.process(1, { status: ReturnStatus.APPROVED }, 1)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('does not touch inventory for REJECTED return', async () => {
      mockPrisma.$transaction.mockImplementation(async (fn: Function) => fn(mockPrisma));
      mockPrisma.return.findUnique.mockResolvedValue(makeReturn(ReturnType.RETURN));
      mockPrisma.return.update.mockResolvedValue({
        ...makeReturn(ReturnType.RETURN),
        status: ReturnStatus.REJECTED,
      });
      mockPrisma.auditLog.create.mockResolvedValue({});

      await service.process(1, { status: ReturnStatus.REJECTED }, 1);

      expect(mockInventorySvc.atomicAdd).not.toHaveBeenCalled();
      expect(mockInventorySvc.atomicDeduct).not.toHaveBeenCalled();
    });
  });
});
