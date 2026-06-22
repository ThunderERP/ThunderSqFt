import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AutomationService } from './automation.service';
import { ZapierAuthGuard } from '../../common/guards/zapier-auth.guard';

@ApiTags('Automation Followups')
@ApiBearerAuth('JWT-auth')
@UseGuards(ZapierAuthGuard)
@Controller('followups')
export class FollowupsController {
  constructor(private readonly service: AutomationService) {}

  @Get('overdue')
  @ApiOperation({ summary: 'Get all overdue follow-ups for escalation' })
  getOverdueFollowUps() {
    return this.service.getOverdueFollowUps();
  }
}
