import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AutomationService } from './automation.service';
import { ZapierAuthGuard } from '../../common/guards/zapier-auth.guard';

@ApiTags('Automation')
@ApiBearerAuth('JWT-auth')
@UseGuards(ZapierAuthGuard)
@Controller('automation')
export class AutomationController {
  constructor(private readonly service: AutomationService) {}

  @Get('daily-reminders')
  @ApiOperation({ summary: 'Get daily follow-up reminders for agent loops' })
  getDailyReminders() {
    return this.service.getDailyReminders();
  }
}
