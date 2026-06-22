// src/modules/finance/finance.controller.ts
import {
  Controller, Get, Query, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { FinanceService } from './finance.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('Finance')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('finance')
export class FinanceController {
  constructor(private svc: FinanceService) {}

  @Get('dashboard')
  @Roles(
    Role.FINANCE_MANAGER, Role.BUSINESS_OWNER,
    Role.SALES_MANAGER, Role.INVENTORY_MANAGER,
    Role.DEVELOPER_ADMIN,
  )
  @ApiOperation({
    summary: 'Real-time dashboard KPIs — revenue, orders, invoices, stock, CRM',
  })
  getDashboard() { return this.svc.getDashboardSummary(); }

  @Get('accounts-receivable')
  @Roles(Role.FINANCE_MANAGER, Role.ACCOUNTANT, Role.BUSINESS_OWNER, Role.DEVELOPER_ADMIN)
  @ApiOperation({ summary: 'Accounts receivable — outstanding customer invoices' })
  @ApiQuery({ name: 'fromDate', required: false, example: '2024-01-01' })
  @ApiQuery({ name: 'toDate', required: false, example: '2024-12-31' })
  getAccountsReceivable(
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string,
  ) {
    return this.svc.getAccountsReceivable(fromDate, toDate);
  }

  @Get('accounts-payable')
  @Roles(Role.FINANCE_MANAGER, Role.ACCOUNTANT, Role.BUSINESS_OWNER, Role.DEVELOPER_ADMIN)
  @ApiOperation({ summary: 'Accounts payable — pending/approved supplier purchases' })
  @ApiQuery({ name: 'fromDate', required: false })
  @ApiQuery({ name: 'toDate', required: false })
  getAccountsPayable(
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string,
  ) {
    return this.svc.getAccountsPayable(fromDate, toDate);
  }

  @Get('cash-flow')
  @Roles(Role.FINANCE_MANAGER, Role.ACCOUNTANT, Role.BUSINESS_OWNER, Role.DEVELOPER_ADMIN)
  @ApiOperation({ summary: 'Cash flow statement for a date range' })
  @ApiQuery({ name: 'fromDate', required: true, example: '2024-01-01' })
  @ApiQuery({ name: 'toDate', required: true, example: '2024-12-31' })
  getCashFlow(
    @Query('fromDate') fromDate: string,
    @Query('toDate') toDate: string,
  ) {
    return this.svc.getCashFlow(fromDate, toDate);
  }

  @Get('sales-report')
  @Roles(
    Role.FINANCE_MANAGER, Role.SALES_MANAGER,
    Role.BUSINESS_OWNER, Role.DEVELOPER_ADMIN,
  )
  @ApiOperation({ summary: 'Sales revenue report with top products' })
  @ApiQuery({ name: 'fromDate', required: true })
  @ApiQuery({ name: 'toDate', required: true })
  @ApiQuery({ name: 'groupBy', required: false, enum: ['day', 'month'] })
  getSalesReport(
    @Query('fromDate') fromDate: string,
    @Query('toDate') toDate: string,
    @Query('groupBy') groupBy: 'day' | 'month' = 'day',
  ) {
    return this.svc.getSalesReport(fromDate, toDate, groupBy);
  }

  @Get('inventory-valuation')
  @Roles(
    Role.FINANCE_MANAGER, Role.INVENTORY_MANAGER,
    Role.BUSINESS_OWNER, Role.DEVELOPER_ADMIN,
  )
  @ApiOperation({ summary: 'Inventory valuation — total stock value at current prices' })
  getInventoryValuation() { return this.svc.getInventoryValuation(); }

  @Get('transaction-ledger')
  @Roles(Role.FINANCE_MANAGER, Role.ACCOUNTANT, Role.DEVELOPER_ADMIN)
  @ApiOperation({ summary: 'Full double-entry transaction ledger' })
  @ApiQuery({ name: 'fromDate', required: false })
  @ApiQuery({ name: 'toDate', required: false })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  getTransactionLedger(
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.svc.getTransactionLedger(fromDate, toDate, Number(page ?? 1), Number(limit ?? 50));
  }
}
