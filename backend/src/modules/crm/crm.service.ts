// src/modules/crm/crm.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CreateLeadDto,
  UpdateLeadDto,
  ConvertLeadDto,
  CreateComplaintDto,
  UpdateComplaintDto,
} from './dto/crm.dto';
import { PaginationDto, paginate } from '../../common/dto/pagination.dto';

@Injectable()
export class CrmService {
  constructor(private prisma: PrismaService) {}

  // ── Leads ──────────────────────────────────────────────────────────────────

  async createLead(dto: CreateLeadDto, userId: number) {
    return this.prisma.lead.create({
      data: { ...dto, status: 'NEW', createdBy: userId },
    });
  }

  async findAllLeads(dto: PaginationDto, status?: string, search?: string) {
    const { page = 1, limit = 20 } = dto;
    const skip = (page - 1) * limit;
    const where = {
      isActive: true,
      ...(status && { status }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' as const } },
          { phone: { contains: search } },
          { email: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
    };
    const [data, total] = await this.prisma.$transaction([
      this.prisma.lead.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
      this.prisma.lead.count({ where }),
    ]);
    return paginate(data, total, page, limit);
  }

  async findOneLead(id: number) {
    const lead = await this.prisma.lead.findUnique({ where: { id } });
    if (!lead || !lead.isActive) throw new NotFoundException(`Lead #${id} not found`);
    return lead;
  }

  async updateLead(id: number, dto: UpdateLeadDto) {
    await this.findOneLead(id);
    return this.prisma.lead.update({ where: { id }, data: dto });
  }

  async convertLead(id: number, dto: ConvertLeadDto, userId: number) {
    const lead = await this.findOneLead(id);
    if (lead.status === 'CONVERTED') {
      throw new ConflictException('Lead is already converted');
    }

    return this.prisma.$transaction(async (tx) => {
      let customerId: number;

      if (dto.existingCustomerId) {
        // Link to existing customer
        const customer = await tx.customer.findUnique({
          where: { id: dto.existingCustomerId },
        });
        if (!customer || !customer.isActive) {
          throw new NotFoundException(`Customer #${dto.existingCustomerId} not found`);
        }
        customerId = customer.id;
      } else {
        // Create new customer from lead data
        if (!lead.phone) throw new BadRequestException('Lead must have a phone number to convert');
        const existing = await tx.customer.findUnique({ where: { phone: lead.phone } });
        if (existing)
          throw new ConflictException(`Customer with phone ${lead.phone} already exists`);

        const customer = await tx.customer.create({
          data: {
            name: lead.name,
            phone: lead.phone,
            email: lead.email ?? undefined,
            createdBy: userId,
          },
        });
        customerId = customer.id;
      }

      const updated = await tx.lead.update({
        where: { id },
        data: {
          status: 'CONVERTED',
          convertedToCustomerId: customerId,
        },
      });

      await tx.auditLog.create({
        data: {
          userId,
          action: 'LEAD_CONVERTED',
          entityType: 'Lead',
          entityId: id,
          newValue: { customerId, convertedBy: userId },
        },
      });

      return { lead: updated, customerId };
    });
  }

  async deleteLead(id: number) {
    await this.findOneLead(id);
    return this.prisma.lead.update({ where: { id }, data: { isActive: false } });
  }

  // ── Complaints ─────────────────────────────────────────────────────────────

  async createComplaint(dto: CreateComplaintDto, userId: number) {
    const customer = await this.prisma.customer.findUnique({
      where: { id: dto.customerId },
    });
    if (!customer || !customer.isActive) {
      throw new NotFoundException(`Customer #${dto.customerId} not found`);
    }
    return this.prisma.complaint.create({
      data: { ...dto, status: 'OPEN', createdBy: userId },
    });
  }

  async findAllComplaints(dto: PaginationDto, status?: string, customerId?: number) {
    const { page = 1, limit = 20 } = dto;
    const skip = (page - 1) * limit;
    const where = {
      ...(status && { status }),
      ...(customerId && { customerId }),
    };
    const [data, total] = await this.prisma.$transaction([
      this.prisma.complaint.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
      }),
      this.prisma.complaint.count({ where }),
    ]);
    return paginate(data, total, page, limit);
  }

  async findOneComplaint(id: number) {
    const c = await this.prisma.complaint.findUnique({ where: { id } });
    if (!c) throw new NotFoundException(`Complaint #${id} not found`);
    return c;
  }

  async updateComplaint(id: number, dto: UpdateComplaintDto, userId: number) {
    await this.findOneComplaint(id);
    const data: Record<string, unknown> = { ...dto };
    if (dto.status === 'RESOLVED' || dto.status === 'CLOSED') {
      data.resolvedAt = new Date();
      data.resolvedBy = userId;
    }
    return this.prisma.complaint.update({ where: { id }, data });
  }
}
