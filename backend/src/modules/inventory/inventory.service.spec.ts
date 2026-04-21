// src/modules/inventory/inventory.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { InventoryService } from './inventory.service';
import { PrismaService } from '../../prisma/prisma.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

const mockPrisma = {
  inventory: { findUnique: jest.fn(), update: jest.fn(), findMany: jest.fn(), count: jest.fn() },
  stockMovement: { create: jest.fn(), findMany: jest.fn(), count: jest.fn() },
  product: { findUnique: jest.fn() },
  $queryRaw: jest.fn(),
  $executeRaw: jest.fn(),
  $transaction: jest.fn(),
};

describe('InventoryService', () => {
  let service: InventoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InventoryService, { provide: PrismaService, useValue: mockPrisma }],
    }).compile();

    service = module.get<InventoryService>(InventoryService);
    jest.clearAllMocks();
  });

  // ── adjustStock ────────────────────────────────────────────────────────────
  describe('adjustStock', () => {
    it('throws BadRequestException when quantity is 0', async () => {
      await expect(service.adjustStock(1, { quantity: 0, note: 'test' }, 1)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('throws BadRequestException when adjustment would make stock negative', async () => {
      mockPrisma.$transaction.mockImplementation(async (fn: Function) => {
        mockPrisma.$queryRaw.mockResolvedValue([{ available_qty: 5 }]);
        return fn(mockPrisma);
      });
      await expect(service.adjustStock(1, { quantity: -10, note: 'test' }, 1)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('successfully adjusts stock positively', async () => {
      mockPrisma.$transaction.mockImplementation(async (fn: Function) => {
        mockPrisma.$queryRaw.mockResolvedValue([{ available_qty: 50 }]);
        mockPrisma.inventory.update.mockResolvedValue({ productId: 1, availableQty: 60 });
        mockPrisma.stockMovement.create.mockResolvedValue({ id: 1 });
        mockPrisma.inventory.findUnique.mockResolvedValue({ productId: 1, availableQty: 60 });
        return fn(mockPrisma);
      });

      await service.adjustStock(1, { quantity: 10, note: 'Recount' }, 1);
      expect(mockPrisma.inventory.update).toHaveBeenCalledWith(
        expect.objectContaining({ data: { availableQty: 60 } }),
      );
    });
  });

  // ── atomicReserve ──────────────────────────────────────────────────────────
  describe('atomicReserve', () => {
    const tx = {
      $queryRaw: jest.fn(),
      $executeRaw: jest.fn(),
      stockMovement: { create: jest.fn() },
    };

    it('throws NotFoundException when no inventory row found', async () => {
      tx.$queryRaw.mockResolvedValue([]);
      await expect(
        service.atomicReserve(tx as any, {
          productId: 1,
          quantity: 5,
          referenceId: 1,
          referenceType: 'ORDER',
          userId: 1,
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('throws ConflictException when stock is insufficient', async () => {
      tx.$queryRaw.mockResolvedValue([{ available_qty: 3, reserved_qty: 0 }]);
      const { ConflictException } = await import('@nestjs/common');
      await expect(
        service.atomicReserve(tx as any, {
          productId: 1,
          quantity: 5,
          referenceId: 1,
          referenceType: 'ORDER',
          userId: 1,
        }),
      ).rejects.toThrow(ConflictException);
    });

    it('executes UPDATE and creates stock movement when stock is available', async () => {
      tx.$queryRaw.mockResolvedValue([{ available_qty: 10, reserved_qty: 0 }]);
      tx.$executeRaw.mockResolvedValue(1);
      tx.stockMovement.create.mockResolvedValue({ id: 1 });

      await service.atomicReserve(tx as any, {
        productId: 1,
        quantity: 5,
        referenceId: 1,
        referenceType: 'ORDER',
        userId: 1,
      });

      expect(tx.$executeRaw).toHaveBeenCalled();
      expect(tx.stockMovement.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ type: 'RESERVATION', quantity: 5 }),
        }),
      );
    });
  });

  // ── atomicDeduct ───────────────────────────────────────────────────────────
  describe('atomicDeduct', () => {
    const tx = {
      $queryRaw: jest.fn(),
      $executeRaw: jest.fn(),
      stockMovement: { create: jest.fn() },
    };

    it('throws BadRequestException when reserved qty is insufficient', async () => {
      tx.$queryRaw.mockResolvedValue([{ reserved_qty: 2 }]);
      await expect(
        service.atomicDeduct(tx as any, {
          productId: 1,
          quantity: 5,
          referenceId: 1,
          referenceType: 'ORDER',
          userId: 1,
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('successfully deducts from reserved stock', async () => {
      tx.$queryRaw.mockResolvedValue([{ reserved_qty: 10 }]);
      tx.$executeRaw.mockResolvedValue(1);
      tx.stockMovement.create.mockResolvedValue({ id: 1 });

      await service.atomicDeduct(tx as any, {
        productId: 1,
        quantity: 5,
        referenceId: 1,
        referenceType: 'ORDER',
        userId: 1,
      });

      expect(tx.$executeRaw).toHaveBeenCalled();
      expect(tx.stockMovement.create).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ type: 'OUTWARD' }) }),
      );
    });
  });
});
