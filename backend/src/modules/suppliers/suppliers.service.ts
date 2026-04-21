// src/modules/suppliers/suppliers.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateSupplierDto, UpdateSupplierDto } from './dto/supplier.dto';
import { PaginationDto, paginate } from '../../common/dto/pagination.dto';

@Injectable()
export class SuppliersService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateSupplierDto, createdBy: number) {
    return this.prisma.supplier.create({ data: { ...dto, createdBy } });
  }

  async findAll(dto: PaginationDto, search?: string) {
    const { page = 1, limit = 20 } = dto;
    const skip = (page - 1) * limit;
    const where = {
      isActive: true,
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' as const } },
          { email: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
    };
    const [data, total] = await this.prisma.$transaction([
      this.prisma.supplier.findMany({ where, skip, take: limit, orderBy: { name: 'asc' } }),
      this.prisma.supplier.count({ where }),
    ]);
    return paginate(data, total, page, limit);
  }

  async findOne(id: number) {
    const s = await this.prisma.supplier.findUnique({
      where: { id },
      include: {
        purchases: {
          select: { id: true, status: true, totalAmount: true, purchaseDate: true },
          orderBy: { purchaseDate: 'desc' },
          take: 10,
        },
      },
    });
    if (!s || !s.isActive) throw new NotFoundException(`Supplier #${id} not found`);
    return s;
  }

  async update(id: number, dto: UpdateSupplierDto) {
    await this.findOne(id);
    return this.prisma.supplier.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.supplier.update({ where: { id }, data: { isActive: false } });
  }
}
