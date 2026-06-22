import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { AutomationService } from './automation.service';
import { AutomationController } from './automation.controller';
import { ReportsController } from './reports.controller';
import { FollowupsController } from './followups.controller';
import { ContactsController } from './contacts.controller';

@Module({
  imports: [PrismaModule],
  controllers: [
    AutomationController,
    ReportsController,
    FollowupsController,
    ContactsController,
  ],
  providers: [AutomationService],
  exports: [AutomationService],
})
export class AutomationModule {}
