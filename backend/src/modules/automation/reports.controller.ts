import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { AutomationService } from './automation.service';
import { ZapierAuthGuard } from '../../common/guards/zapier-auth.guard';

@ApiTags('Automation Reports')
@ApiBearerAuth('JWT-auth')
@UseGuards(ZapierAuthGuard)
@Controller('reports')
export class ReportsController {
  constructor(private readonly service: AutomationService) {}

  @Get('daily-summary')
  @ApiOperation({ summary: 'Get daily summary metrics for manager alerts' })
  @ApiQuery({ name: 'date', required: false, description: 'Format YYYY-MM-DD' })
  getDailySummary(@Query('date') date?: string) {
    return this.service.getDailySummary(date);
  }

  @Get('monthly')
  @ApiOperation({ summary: 'Get monthly report with PDF generation' })
  @ApiQuery({ name: 'month', required: true, description: 'Format YYYY-MM' })
  @ApiQuery({ name: 'branch_id', required: false })
  getMonthlyReport(
    @Query('month') month: string,
    @Query('branch_id') branchId?: string,
  ) {
    return this.service.getMonthlyReport(month, branchId);
  }
}
