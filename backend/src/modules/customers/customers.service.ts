// src/modules/customers/customers.service.ts
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCustomerDto, UpdateCustomerDto } from './dto/customer.dto';
import { PaginationDto, paginate } from '../../common/dto/pagination.dto';

@Injectable()
export class CustomersService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateCustomerDto, createdBy: number) {
    const exists = await this.prisma.customer.findUnique({ where: { phone: dto.phone } });
    if (exists) throw new ConflictException(`Phone ${dto.phone} already registered`);
    return this.prisma.customer.create({ data: { ...dto, createdBy } });
  }

  async findAll(dto: PaginationDto, search?: string) {
    const { page = 1, limit = 20 } = dto;
    const skip = (page - 1) * limit;
    const where = {
      isActive: true,
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' as const } },
          { phone: { contains: search } },
          { email: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
    };
    const [data, total] = await this.prisma.$transaction([
      this.prisma.customer.findMany({ where, skip, take: limit, orderBy: { name: 'asc' } }),
      this.prisma.customer.count({ where }),
    ]);
    return paginate(data, total, page, limit);
  }

  async findOne(id: number) {
    const c = await this.prisma.customer.findUnique({
      where: { id },
      include: {
        orders: {
          where: { isActive: true },
          select: { id: true, status: true, totalAmount: true, orderDate: true },
          orderBy: { orderDate: 'desc' },
          take: 10,
        },
      },
    });
    if (!c || !c.isActive) throw new NotFoundException(`Customer #${id} not found`);
    return c;
  }

  async update(id: number, dto: UpdateCustomerDto) {
    await this.findOne(id);
    if (dto.phone) {
      const conflict = await this.prisma.customer.findUnique({ where: { phone: dto.phone } });
      if (conflict && conflict.id !== id) throw new ConflictException('Phone already in use');
    }
    return this.prisma.customer.update({ where: { id }, data: dto });
  }

  async remove(id: number, userId: number) {
    await this.findOne(id);
    return this.prisma.customer.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
