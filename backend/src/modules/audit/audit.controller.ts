// src/modules/audit/audit.controller.ts
import { Controller, Get, Param, Query, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { AuditService } from './audit.service';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('Audit')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.DEVELOPER_ADMIN, Role.BUSINESS_OWNER, Role.FINANCE_MANAGER)
@Controller('audit')
export class AuditController {
  constructor(private svc: AuditService) {}

  @Get()
  @ApiOperation({
    summary: 'Query the audit log — filterable by user, entity, action, and date',
    description: 'SRS 2.3: Non-volatile audit log. Captures User_id, Action, Timestamp, Reference_id.',
  })
  @ApiQuery({ name: 'userId', required: false, type: Number })
  @ApiQuery({ name: 'entityType', required: false, example: 'Order' })
  @ApiQuery({ name: 'entityId', required: false, type: Number })
  @ApiQuery({ name: 'action', required: false, example: 'ORDER_CONFIRMED' })
  @ApiQuery({ name: 'fromDate', required: false })
  @ApiQuery({ name: 'toDate', required: false })
  findAll(
    @Query() dto: PaginationDto,
    @Query('userId') userId?: number,
    @Query('entityType') entityType?: string,
    @Query('entityId') entityId?: number,
    @Query('action') action?: string,
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string,
  ) {
    return this.svc.findAll(dto, {
      userId: userId ? Number(userId) : undefined,
      entityType,
      entityId: entityId ? Number(entityId) : undefined,
      action,
      fromDate,
      toDate,
    });
  }

  @Get(':entityType/:entityId')
  @ApiOperation({ summary: 'Full audit trail for a specific entity (e.g. Order #123)' })
  findByEntity(
    @Param('entityType') entityType: string,
    @Param('entityId', ParseIntPipe) entityId: number,
  ) {
    return this.svc.findByEntity(entityType, entityId);
  }
}
