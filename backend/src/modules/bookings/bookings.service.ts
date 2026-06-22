import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    return (this.prisma as any).booking.create({ data });
  }

  async findAll() {
    return (this.prisma as any).booking.findMany({
      include: { customer: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const booking = await (this.prisma as any).booking.findUnique({
      where: { id },
      include: { customer: true },
    });
    if (!booking) throw new NotFoundException('Booking not found');
    return booking;
  }

  async update(id: number, data: any) {
    await this.findOne(id);
    return (this.prisma as any).booking.update({ where: { id }, data });
  }

  async remove(id: number) {
    await this.findOne(id);
    return (this.prisma as any).booking.delete({ where: { id } });
  }
}
