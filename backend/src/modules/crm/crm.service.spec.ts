// src/modules/crm/crm.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { CrmService } from './crm.service';
import { PrismaService } from '../../prisma/prisma.service';
import { NotFoundException, ConflictException } from '@nestjs/common';

const mockPrisma = {
  lead:      { create: jest.fn(), findUnique: jest.fn(), findMany: jest.fn(), findFirst: jest.fn(), update: jest.fn(), count: jest.fn() },
  customer:  { findUnique: jest.fn(), findFirst: jest.fn(), create: jest.fn() },
  complaint: { create: jest.fn(), findUnique: jest.fn(), findMany: jest.fn(), update: jest.fn(), count: jest.fn() },
  auditLog:  { create: jest.fn() },
  $transaction: jest.fn(),
};

const makeLead = (status = 'NEW') => ({
  id: 1, name: 'Test Lead', phone: '9999999999', email: 'lead@test.com',
  source: 'REFERRAL', status, notes: null, assignedTo: null,
  convertedToCustomerId: null, isActive: true, createdBy: 1,
  createdAt: new Date(), updatedAt: new Date(),
});

describe('CrmService', () => {
  let service: CrmService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CrmService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();
    service = module.get<CrmService>(CrmService);
    jest.clearAllMocks();
  });

  // ── createLead ─────────────────────────────────────────────────────────────
  describe('createLead', () => {
    it('creates lead with NEW status', async () => {
      mockPrisma.lead.create.mockResolvedValue(makeLead('NEW'));
      const result = await service.createLead({ name: 'Test', source: 'REFERRAL' }, 1);
      expect(mockPrisma.lead.create).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ status: 'NEW' }) }),
      );
      expect(result.status).toBe('NEW');
    });
  });

  // ── findOneLead ────────────────────────────────────────────────────────────
  describe('findOneLead', () => {
    it('throws NotFoundException for missing lead', async () => {
      mockPrisma.lead.findUnique.mockResolvedValue(null);
      await expect(service.findOneLead(99)).rejects.toThrow(NotFoundException);
    });

    it('throws NotFoundException for inactive lead', async () => {
      mockPrisma.lead.findUnique.mockResolvedValue({ ...makeLead(), isActive: false });
      await expect(service.findOneLead(1)).rejects.toThrow(NotFoundException);
    });
  });

  // ── convertLead ────────────────────────────────────────────────────────────
  describe('convertLead', () => {
    it('throws ConflictException if already converted', async () => {
      mockPrisma.lead.findUnique.mockResolvedValue(makeLead('CONVERTED'));
      await expect(service.convertLead(1, {}, 1)).rejects.toThrow(ConflictException);
    });

    it('creates new customer when no existingCustomerId given', async () => {
      mockPrisma.lead.findUnique.mockResolvedValue(makeLead('NEW'));
      mockPrisma.$transaction.mockImplementation(async (fn: Function) => fn(mockPrisma));
      mockPrisma.customer.findFirst.mockResolvedValue(null); // no existing phone match
      mockPrisma.customer.create.mockResolvedValue({ id: 5, name: 'Test Lead', phone: '9999999999' });
      mockPrisma.lead.update.mockResolvedValue({ ...makeLead('CONVERTED'), convertedToCustomerId: 5 });
      mockPrisma.auditLog.create.mockResolvedValue({});

      const result = await service.convertLead(1, {}, 1);
      expect(mockPrisma.customer.create).toHaveBeenCalled();
      expect(result.customerId).toBe(5);
    });

    it('links to existing customer when existingCustomerId is provided', async () => {
      mockPrisma.lead.findUnique.mockResolvedValue(makeLead('NEW'));
      mockPrisma.$transaction.mockImplementation(async (fn: Function) => fn(mockPrisma));
      mockPrisma.customer.findUnique.mockResolvedValue({ id: 3, name: 'Existing', isActive: true });
      mockPrisma.lead.update.mockResolvedValue({ ...makeLead('CONVERTED'), convertedToCustomerId: 3 });
      mockPrisma.auditLog.create.mockResolvedValue({});

      const result = await service.convertLead(1, { existingCustomerId: 3 }, 1);
      expect(mockPrisma.customer.create).not.toHaveBeenCalled();
      expect(result.customerId).toBe(3);
    });
  });

  // ── createComplaint ────────────────────────────────────────────────────────
  describe('createComplaint', () => {
    it('throws NotFoundException if customer does not exist', async () => {
      mockPrisma.customer.findUnique.mockResolvedValue(null);
      await expect(
        service.createComplaint({ customerId: 99, subject: 'Test', description: 'Details' }, 1),
      ).rejects.toThrow(NotFoundException);
    });

    it('creates complaint with OPEN status', async () => {
      mockPrisma.customer.findUnique.mockResolvedValue({ id: 1, isActive: true });
      mockPrisma.complaint.create.mockResolvedValue({ id: 1, status: 'OPEN' });
      const result = await service.createComplaint({ customerId: 1, subject: 'Issue', description: 'Long description here' }, 1);
      expect(mockPrisma.complaint.create).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ status: 'OPEN' }) }),
      );
    });
  });
});
