// src/modules/payments/payments.controller.ts
import { Controller, Get, Post, Body, Param, Query, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/payment.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../common/types/request.types';
import { Role } from '@prisma/client';

@ApiTags('Payments')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('payments')
export class PaymentsController {
  constructor(private svc: PaymentsService) {}

  @Post()
  @Roles(Role.ACCOUNTANT, Role.FINANCE_MANAGER, Role.DEVELOPER_ADMIN)
  @ApiOperation({
    summary: 'Record a payment against an invoice',
    description:
      'Validates invoice exists and is not fully paid. Checks amount ≤ pending balance. ' +
      'Updates invoice status (PARTIAL or PAID). Writes ledger entry.',
  })
  create(@Body() dto: CreatePaymentDto, @CurrentUser() u: AuthenticatedUser) {
    return this.svc.create(dto, u.sub);
  }

  @Get()
  @ApiOperation({ summary: 'List all payments, optionally filtered by invoice' })
  @ApiQuery({ name: 'invoiceId', required: false, type: Number })
  findAll(@Query() dto: PaginationDto, @Query('invoiceId') invoiceId?: number) {
    return this.svc.findAll(dto, invoiceId ? Number(invoiceId) : undefined);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get payment details with ledger entry' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.svc.findOne(id);
  }
}
