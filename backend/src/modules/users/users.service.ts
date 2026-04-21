// src/modules/users/users.service.ts
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto, paginate } from '../../common/dto/pagination.dto';
import * as bcrypt from 'bcrypt';

const SELECT = {
  id: true,
  name: true,
  email: true,
  role: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
};

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll(dto: PaginationDto) {
    const { page = 1, limit = 20 } = dto;
    const skip = (page - 1) * limit;
    const [users, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        skip,
        take: limit,
        select: SELECT,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count(),
    ]);
    return paginate(users, total, page, limit);
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id }, select: SELECT });
    if (!user) throw new NotFoundException(`User #${id} not found`);
    return user;
  }

  async update(id: number, dto: UpdateUserDto) {
    await this.findOne(id);

    if (dto.email) {
      const conflict = await this.prisma.user.findUnique({ where: { email: dto.email } });
      if (conflict && conflict.id !== id) throw new ConflictException('Email already in use');
    }

    const data: Record<string, unknown> = { ...dto };
    if (dto.password) {
      data.passwordHash = await bcrypt.hash(dto.password, 12);
      delete data.password;
    }

    return this.prisma.user.update({ where: { id }, data, select: SELECT });
  }

  async deactivate(id: number) {
    await this.findOne(id);
    return this.prisma.user.update({
      where: { id },
      data: { isActive: false },
      select: SELECT,
    });
  }

  async activate(id: number) {
    await this.findOne(id);
    return this.prisma.user.update({
      where: { id },
      data: { isActive: true },
      select: SELECT,
    });
  }
}
