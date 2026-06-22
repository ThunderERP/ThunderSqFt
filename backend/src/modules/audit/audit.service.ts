// src/modules/audit/audit.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PaginationDto, paginate } from '../../common/dto/pagination.dto';

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  // SRS 2.3: Log must capture User_id, Action, Timestamp, reference_id
  async findAll(
    dto: PaginationDto,
    filters: {
      userId?: number;
      entityType?: string;
      entityId?: number;
      action?: string;
      fromDate?: string;
      toDate?: string;
    },
  ) {
    const { page = 1, limit = 50 } = dto;
    const skip = (page - 1) * limit;

    const where = {
      ...(filters.userId && { userId: filters.userId }),
      ...(filters.entityType && { entityType: filters.entityType }),
      ...(filters.entityId && { entityId: filters.entityId }),
      ...(filters.action && { action: { contains: filters.action, mode: 'insensitive' as const } }),
      ...(filters.fromDate && { timestamp: { gte: new Date(filters.fromDate) } }),
      ...(filters.toDate && { timestamp: { lte: new Date(filters.toDate) } }),
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.auditLog.findMany({
        where,
        skip,
        take: limit,
        orderBy: { timestamp: 'desc' },
        include: {
          user: { select: { id: true, name: true, email: true, role: true } },
        },
      }),
      this.prisma.auditLog.count({ where }),
    ]);

    return paginate(data, total, page, limit);
  }

  async findByEntity(entityType: string, entityId: number) {
    return this.prisma.auditLog.findMany({
      where: { entityType, entityId },
      orderBy: { timestamp: 'desc' },
      include: {
        user: { select: { id: true, name: true, role: true } },
      },
    });
  }

  async getActionSummary(fromDate?: string, toDate?: string) {
    if (fromDate && toDate) {
      const from = new Date(fromDate);
      const to = new Date(toDate);
      return this.prisma.$queryRaw<
        { action: string; count: bigint; last_seen: Date }[]
      >`
        SELECT action, COUNT(*) as count, MAX(timestamp) as last_seen
        FROM audit_logs
        WHERE timestamp BETWEEN ${from} AND ${to}
        GROUP BY action
        ORDER BY count DESC
      `;
    }
    return this.prisma.$queryRaw<
      { action: string; count: bigint; last_seen: Date }[]
    >`
      SELECT action, COUNT(*) as count, MAX(timestamp) as last_seen
      FROM audit_logs
      GROUP BY action
      ORDER BY count DESC
    `;
  }
}
