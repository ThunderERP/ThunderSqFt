// src/modules/products/products.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { PaginationDto, paginate } from '../../common/dto/pagination.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateProductDto, createdBy: number) {
    return this.prisma.$transaction(async (tx) => {
      const product = await tx.product.create({
        data: {
          name: dto.name,
          category: dto.category,
          unit: dto.unit,
          price: dto.price,
          gstPercentage: dto.gstPercentage,
          discountPercentage: dto.discountPercentage ?? 0,
          expiryDate: dto.expiryDate ? new Date(dto.expiryDate) : null,
          manufacturingDate: dto.manufacturingDate ? new Date(dto.manufacturingDate) : null,
          createdBy,
        },
      });

      // Auto-create an Inventory record for every new product
      await tx.inventory.create({
        data: {
          productId: product.id,
          availableQty: 0,
          reservedQty: 0,
          reorderLevel: 10,
        },
      });

      return product;
    });
  }

  async findAll(dto: PaginationDto, search?: string, category?: string) {
    const { page = 1, limit = 20 } = dto;
    const skip = (page - 1) * limit;
    const where = {
      isActive: true,
      ...(search && { name: { contains: search, mode: 'insensitive' as const } }),
      ...(category && { category: { equals: category, mode: 'insensitive' as const } }),
    };
    const [data, total] = await this.prisma.$transaction([
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { name: 'asc' },
        include: { inventory: true },
      }),
      this.prisma.product.count({ where }),
    ]);
    return paginate(data, total, page, limit);
  }

  async findOne(id: number) {
    const p = await this.prisma.product.findUnique({
      where: { id },
      include: { inventory: true },
    });
    if (!p || !p.isActive) throw new NotFoundException(`Product #${id} not found`);
    return p;
  }

  async update(id: number, dto: UpdateProductDto) {
    await this.findOne(id);
    return this.prisma.product.update({
      where: { id },
      data: {
        ...dto,
        expiryDate: dto.expiryDate ? new Date(dto.expiryDate) : undefined,
        manufacturingDate: dto.manufacturingDate ? new Date(dto.manufacturingDate) : undefined,
      },
      include: { inventory: true },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.product.update({
      where: { id },
      data: { isActive: false, deletedAt: new Date() },
    });
  }

  async getCategories() {
    const rows = await this.prisma.product.findMany({
      where: { isActive: true, category: { not: null } },
      select: { category: true },
      distinct: ['category'],
      orderBy: { category: 'asc' },
    });
    return rows.map((r) => r.category).filter(Boolean);
  }
}
