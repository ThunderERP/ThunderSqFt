import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AutomationService } from './automation.service';
import { ZapierAuthGuard } from '../../common/guards/zapier-auth.guard';

@ApiTags('Automation Contacts')
@ApiBearerAuth('JWT-auth')
@UseGuards(ZapierAuthGuard)
@Controller('contacts')
export class ContactsController {
  constructor(private readonly service: AutomationService) {}

  @Get('birthdays-today')
  @ApiOperation({ summary: 'Get list of birthdays today (waOptIn only)' })
  getBirthdaysToday() {
    return this.service.getBirthdaysToday();
  }

  @Get('anniversaries-today')
  @ApiOperation({ summary: 'Get list of wedding anniversaries today (waOptIn only)' })
  getAnniversariesToday() {
    return this.service.getAnniversariesToday();
  }
}
