// src/modules/payments/payments.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsService } from './payments.service';
import { PrismaService } from '../../prisma/prisma.service';
import {
  BadRequestException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PaymentMethod } from '@prisma/client';

const mockPrisma = {
  payment: { create: jest.fn(), findMany: jest.fn(), findUnique: jest.fn(), count: jest.fn() },
  invoice: { update: jest.fn() },
  transaction: { create: jest.fn(), findMany: jest.fn() },
  auditLog: { create: jest.fn() },
  $queryRaw: jest.fn(),
  $transaction: jest.fn(),
};

describe('PaymentsService', () => {
  let service: PaymentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PaymentsService, { provide: PrismaService, useValue: mockPrisma }],
    }).compile();
    service = module.get<PaymentsService>(PaymentsService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    const dto = { invoiceId: 1, amount: 500, paymentMethod: PaymentMethod.UPI };

    it('throws NotFoundException if invoice does not exist', async () => {
      mockPrisma.$transaction.mockImplementation(async (fn: Function) => {
        mockPrisma.$queryRaw.mockResolvedValue([]);
        return fn(mockPrisma);
      });
      await expect(service.create(dto, 1)).rejects.toThrow(NotFoundException);
    });

    it('throws UnprocessableEntityException if invoice is already PAID', async () => {
      mockPrisma.$transaction.mockImplementation(async (fn: Function) => {
        mockPrisma.$queryRaw.mockResolvedValue([
          {
            id: 1,
            total_amount: '1000.00',
            paid_amount: '1000.00',
            status: 'PAID',
          },
        ]);
        return fn(mockPrisma);
      });
      await expect(service.create(dto, 1)).rejects.toThrow(UnprocessableEntityException);
    });

    it('throws BadRequestException if amount exceeds pending balance', async () => {
      mockPrisma.$transaction.mockImplementation(async (fn: Function) => {
        mockPrisma.$queryRaw.mockResolvedValue([
          {
            id: 1,
            total_amount: '1000.00',
            paid_amount: '600.00',
            status: 'PARTIAL',
          },
        ]);
        return fn(mockPrisma);
      });
      await expect(service.create({ ...dto, amount: 500 }, 1)).rejects.toThrow(BadRequestException);
    });

    it('sets invoice status to PARTIAL when partially paid', async () => {
      mockPrisma.$transaction.mockImplementation(async (fn: Function) => {
        mockPrisma.$queryRaw.mockResolvedValue([
          {
            id: 1,
            total_amount: '1000.00',
            paid_amount: '0.00',
            status: 'PENDING',
          },
        ]);
        mockPrisma.payment.create.mockResolvedValue({ id: 1, amount: '500.00' });
        mockPrisma.invoice.update.mockResolvedValue({});
        mockPrisma.transaction.create.mockResolvedValue({});
        mockPrisma.auditLog.create.mockResolvedValue({});
        return fn(mockPrisma);
      });

      const result = await service.create({ ...dto, amount: 500 }, 1);
      expect(result.invoiceStatus).toBe('PARTIAL');
      expect(mockPrisma.invoice.update).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ status: 'PARTIAL' }) }),
      );
    });

    it('sets invoice status to PAID when fully paid', async () => {
      mockPrisma.$transaction.mockImplementation(async (fn: Function) => {
        mockPrisma.$queryRaw.mockResolvedValue([
          {
            id: 1,
            total_amount: '1000.00',
            paid_amount: '0.00',
            status: 'PENDING',
          },
        ]);
        mockPrisma.payment.create.mockResolvedValue({ id: 1, amount: '1000.00' });
        mockPrisma.invoice.update.mockResolvedValue({});
        mockPrisma.transaction.create.mockResolvedValue({});
        mockPrisma.auditLog.create.mockResolvedValue({});
        return fn(mockPrisma);
      });

      const result = await service.create({ ...dto, amount: 1000 }, 1);
      expect(result.invoiceStatus).toBe('PAID');
    });

    it('creates a CREDIT ledger entry on payment', async () => {
      mockPrisma.$transaction.mockImplementation(async (fn: Function) => {
        mockPrisma.$queryRaw.mockResolvedValue([
          {
            id: 1,
            total_amount: '500.00',
            paid_amount: '0.00',
            status: 'PENDING',
          },
        ]);
        mockPrisma.payment.create.mockResolvedValue({ id: 1 });
        mockPrisma.invoice.update.mockResolvedValue({});
        mockPrisma.transaction.create.mockResolvedValue({});
        mockPrisma.auditLog.create.mockResolvedValue({});
        return fn(mockPrisma);
      });

      await service.create({ ...dto, amount: 500 }, 1);
      expect(mockPrisma.transaction.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ type: 'CREDIT', accountCode: 'ACCOUNTS_RECEIVABLE' }),
        }),
      );
    });
  });
});
