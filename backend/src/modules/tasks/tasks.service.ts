import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    return (this.prisma as any).task.create({ data });
  }

  async findAll() {
    return (this.prisma as any).task.findMany({
      include: { assigned_to: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const task = await (this.prisma as any).task.findUnique({
      where: { id },
      include: { assigned_to: true },
    });
    if (!task) throw new NotFoundException('Task not found');
    return task;
  }

  async update(id: number, data: any) {
    await this.findOne(id);
    return (this.prisma as any).task.update({ where: { id }, data });
  }

  async remove(id: number) {
    await this.findOne(id);
    return (this.prisma as any).task.delete({ where: { id } });
  }
}
