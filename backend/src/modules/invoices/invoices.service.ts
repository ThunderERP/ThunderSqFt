// src/modules/invoices/invoices.service.ts
import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PaginationDto, paginate } from '../../common/dto/pagination.dto';
import { InvoiceStatus } from '@prisma/client';
import { UpdateInvoiceDto } from './dto/invoice.dto';

const INVOICE_INCLUDE = {
  order: {
    include: {
      customer: { select: { id: true, name: true, phone: true, email: true } },
      items: {
        include: { product: { select: { id: true, name: true, unit: true } } },
      },
    },
  },
  payments: {
    orderBy: { date: 'desc' as const },
    take: 5,
  },
};

@Injectable()
export class InvoicesService {
  constructor(private prisma: PrismaService) {}

  async findAll(dto: PaginationDto, status?: InvoiceStatus) {
    const { page = 1, limit = 20 } = dto;
    const skip = (page - 1) * limit;
    const where = {
      isActive: true,
      ...(status && { status }),
    };
    const [data, total] = await this.prisma.$transaction([
      this.prisma.invoice.findMany({
        where,
        skip,
        take: limit,
        orderBy: { invoiceDate: 'desc' },
        include: {
          order: {
            include: {
              customer: { select: { id: true, name: true } },
            },
          },
          _count: { select: { payments: true } },
        },
      }),
      this.prisma.invoice.count({ where }),
    ]);
    return paginate(data, total, page, limit);
  }

  async findOne(id: number) {
    const inv = await this.prisma.invoice.findUnique({
      where: { id },
      include: INVOICE_INCLUDE,
    });
    if (!inv) throw new NotFoundException(`Invoice #${id} not found`);
    return inv;
  }

  async findByOrder(orderId: number) {
    const inv = await this.prisma.invoice.findUnique({
      where: { orderId },
      include: INVOICE_INCLUDE,
    });
    if (!inv) throw new NotFoundException(`Invoice for order #${orderId} not found`);
    return inv;
  }

  async update(id: number, dto: UpdateInvoiceDto) {
    const inv = await this.prisma.invoice.findUnique({ where: { id } });
    if (!inv) throw new NotFoundException(`Invoice #${id} not found`);

    // Paid invoices cannot be edited per SRS
    if (inv.status === InvoiceStatus.PAID) {
      throw new UnprocessableEntityException('Paid invoices cannot be modified');
    }

    return this.prisma.invoice.update({
      where: { id },
      data: {
        ...(dto.status && { status: dto.status }),
        ...(dto.dueDate && { dueDate: new Date(dto.dueDate) }),
      },
      include: INVOICE_INCLUDE,
    });
  }
}
