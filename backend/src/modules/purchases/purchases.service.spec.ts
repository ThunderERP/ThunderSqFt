// src/modules/purchases/purchases.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { PurchasesService } from './purchases.service';
import { PrismaService } from '../../prisma/prisma.service';
import { InventoryService } from '../inventory/inventory.service';
import {
  NotFoundException,
  ForbiddenException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PurchaseStatus, Role } from '@prisma/client';

const mockPrisma = {
  supplier: { findUnique: jest.fn() },
  product:  { findMany: jest.fn() },
  purchase: { create: jest.fn(), findUnique: jest.fn(), update: jest.fn(), findMany: jest.fn(), count: jest.fn() },
  auditLog: { create: jest.fn() },
  $transaction: jest.fn(),
};

const mockInventorySvc = { atomicAdd: jest.fn() };

const makePurchase = (status: PurchaseStatus, items = [{ id: 1, productId: 1, quantity: 10, unitPrice: '100', lineTotal: '1000', purchaseId: 1 }]) => ({
  id: 1, supplierId: 1, status, totalAmount: '1000', isActive: true,
  createdBy: 1, approvedBy: null, approvedAt: null,
  purchaseDate: new Date(), createdAt: new Date(), updatedAt: new Date(),
  notes: null, expectedDeliveryDate: null,
  items,
  supplier: { id: 1, name: 'Test Supplier', email: null },
});

describe('PurchasesService', () => {
  let service: PurchasesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PurchasesService,
        { provide: PrismaService,    useValue: mockPrisma },
        { provide: InventoryService, useValue: mockInventorySvc },
      ],
    }).compile();
    service = module.get<PurchasesService>(PurchasesService);
    jest.clearAllMocks();
  });

  // ── create ─────────────────────────────────────────────────────────────────
  describe('create', () => {
    it('throws NotFoundException when supplier does not exist', async () => {
      mockPrisma.supplier.findUnique.mockResolvedValue(null);
      await expect(
        service.create({ supplierId: 99, items: [{ productId: 1, quantity: 5, unitPrice: 100 }] }, 1),
      ).rejects.toThrow(NotFoundException);
    });

    it('creates purchase with PENDING status', async () => {
      mockPrisma.supplier.findUnique.mockResolvedValue({ id: 1, isActive: true });
      mockPrisma.product.findMany.mockResolvedValue([{ id: 1, isActive: true }]);
      mockPrisma.purchase.create.mockResolvedValue(makePurchase(PurchaseStatus.PENDING));

      const result = await service.create(
        { supplierId: 1, items: [{ productId: 1, quantity: 5, unitPrice: 100 }] }, 1,
      );
      expect(result.status).toBe(PurchaseStatus.PENDING);
    });
  });

  // ── approve — Business Owner only (SRS 4.2) ────────────────────────────────
  describe('approve', () => {
    it('throws ForbiddenException for non-BUSINESS_OWNER roles', async () => {
      await expect(service.approve(1, 1, Role.SALES_MANAGER)).rejects.toThrow(ForbiddenException);
      await expect(service.approve(1, 1, Role.INVENTORY_MANAGER)).rejects.toThrow(ForbiddenException);
      await expect(service.approve(1, 1, Role.FINANCE_MANAGER)).rejects.toThrow(ForbiddenException);
    });

    it('allows BUSINESS_OWNER to approve', async () => {
      mockPrisma.purchase.findUnique.mockResolvedValue(makePurchase(PurchaseStatus.PENDING));
      mockPrisma.$transaction.mockImplementation(async (fn: Function) => fn(mockPrisma));
      mockPrisma.purchase.update.mockResolvedValue(makePurchase(PurchaseStatus.APPROVED));
      mockPrisma.auditLog.create.mockResolvedValue({});

      const result = await service.approve(1, 1, Role.BUSINESS_OWNER);
      expect(result.status).toBe(PurchaseStatus.APPROVED);
    });

    it('allows DEVELOPER_ADMIN to approve', async () => {
      mockPrisma.purchase.findUnique.mockResolvedValue(makePurchase(PurchaseStatus.PENDING));
      mockPrisma.$transaction.mockImplementation(async (fn: Function) => fn(mockPrisma));
      mockPrisma.purchase.update.mockResolvedValue(makePurchase(PurchaseStatus.APPROVED));
      mockPrisma.auditLog.create.mockResolvedValue({});

      const result = await service.approve(1, 1, Role.DEVELOPER_ADMIN);
      expect(result.status).toBe(PurchaseStatus.APPROVED);
    });

    it('throws UnprocessableEntityException if purchase not PENDING', async () => {
      mockPrisma.purchase.findUnique.mockResolvedValue(makePurchase(PurchaseStatus.APPROVED));
      await expect(service.approve(1, 1, Role.BUSINESS_OWNER)).rejects.toThrow(UnprocessableEntityException);
    });
  });

  // ── receiveGoods (SRS 4.2: increases available_quantity) ──────────────────
  describe('receiveGoods', () => {
    it('throws UnprocessableEntityException if not APPROVED', async () => {
      mockPrisma.$transaction.mockImplementation(async (fn: Function) => fn(mockPrisma));
      mockPrisma.purchase.findUnique.mockResolvedValue(makePurchase(PurchaseStatus.PENDING));
      await expect(service.receiveGoods(1, 1)).rejects.toThrow(UnprocessableEntityException);
    });

    it('calls atomicAdd for each item on goods receipt', async () => {
      const purchase = makePurchase(PurchaseStatus.APPROVED);
      mockPrisma.$transaction.mockImplementation(async (fn: Function) => fn(mockPrisma));
      mockPrisma.purchase.findUnique.mockResolvedValue(purchase);
      mockInventorySvc.atomicAdd.mockResolvedValue(undefined);
      mockPrisma.purchase.update.mockResolvedValue({ ...purchase, status: PurchaseStatus.RECEIVED });
      mockPrisma.auditLog.create.mockResolvedValue({});

      await service.receiveGoods(1, 1);

      expect(mockInventorySvc.atomicAdd).toHaveBeenCalledTimes(purchase.items.length);
      expect(mockInventorySvc.atomicAdd).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ productId: 1, quantity: 10, referenceType: 'PURCHASE' }),
      );
    });
  });
});
