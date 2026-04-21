// src/modules/invoices/invoices.controller.ts
import {
  Controller,
  Get,
  Patch,
  Body,
  Param,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { InvoicesService } from './invoices.service';
import { UpdateInvoiceDto } from './dto/invoice.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role, InvoiceStatus } from '@prisma/client';

@ApiTags('Invoices')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('invoices')
export class InvoicesController {
  constructor(private svc: InvoicesService) {}

  @Get()
  @ApiOperation({ summary: 'List all invoices' })
  @ApiQuery({ name: 'status', enum: InvoiceStatus, required: false })
  findAll(@Query() dto: PaginationDto, @Query('status') status?: InvoiceStatus) {
    return this.svc.findAll(dto, status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get invoice with full order and payment details' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.svc.findOne(id);
  }

  @Get('by-order/:orderId')
  @ApiOperation({ summary: 'Get invoice for a specific order' })
  findByOrder(@Param('orderId', ParseIntPipe) orderId: number) {
    return this.svc.findByOrder(orderId);
  }

  @Patch(':id')
  @Roles(Role.FINANCE_MANAGER, Role.ACCOUNTANT, Role.DEVELOPER_ADMIN)
  @ApiOperation({ summary: 'Update invoice status or due date (PAID invoices are locked)' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateInvoiceDto) {
    return this.svc.update(id, dto);
  }
}
