// src/modules/crm/crm.controller.ts
import {
  Controller, Get, Post, Patch, Delete, Body, Param,
  Query, ParseIntPipe, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { CrmService } from './crm.service';
import {
  CreateLeadDto, UpdateLeadDto, ConvertLeadDto,
  CreateComplaintDto, UpdateComplaintDto,
} from './dto/crm.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../common/types/request.types';
import { Role } from '@prisma/client';

@ApiTags('CRM')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('crm')
export class CrmController {
  constructor(private svc: CrmService) {}

  // ── Leads ──────────────────────────────────────────────────────────────────

  @Post('leads')
  @Roles(Role.CRM_SUPPORT, Role.SALES_STAFF, Role.SALES_MANAGER, Role.DEVELOPER_ADMIN)
  @ApiOperation({ summary: 'Create a new sales lead' })
  createLead(@Body() dto: CreateLeadDto, @CurrentUser() u: AuthenticatedUser) {
    return this.svc.createLead(dto, u.sub);
  }

  @Get('leads')
  @ApiOperation({ summary: 'List leads with optional status/search filter' })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'search', required: false })
  findAllLeads(
    @Query() dto: PaginationDto,
    @Query('status') status?: string,
    @Query('search') search?: string,
  ) {
    return this.svc.findAllLeads(dto, status, search);
  }

  @Get('leads/:id')
  @ApiOperation({ summary: 'Get lead details' })
  findOneLead(@Param('id', ParseIntPipe) id: number) { return this.svc.findOneLead(id); }

  @Patch('leads/:id')
  @Roles(Role.CRM_SUPPORT, Role.SALES_STAFF, Role.SALES_MANAGER, Role.DEVELOPER_ADMIN)
  @ApiOperation({ summary: 'Update lead details or status' })
  updateLead(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateLeadDto) {
    return this.svc.updateLead(id, dto);
  }

  @Post('leads/:id/convert')
  @Roles(Role.CRM_SUPPORT, Role.SALES_MANAGER, Role.DEVELOPER_ADMIN)
  @ApiOperation({ summary: 'Convert lead to customer' })
  convertLead(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ConvertLeadDto,
    @CurrentUser() u: AuthenticatedUser,
  ) {
    return this.svc.convertLead(id, dto, u.sub);
  }

  @Delete('leads/:id')
  @Roles(Role.CRM_SUPPORT, Role.SALES_MANAGER, Role.DEVELOPER_ADMIN)
  @ApiOperation({ summary: 'Soft-delete a lead' })
  deleteLead(@Param('id', ParseIntPipe) id: number) { return this.svc.deleteLead(id); }

  // ── Complaints ─────────────────────────────────────────────────────────────

  @Post('complaints')
  @Roles(Role.CRM_SUPPORT, Role.SALES_STAFF, Role.DEVELOPER_ADMIN)
  @ApiOperation({ summary: 'Log a customer complaint' })
  createComplaint(@Body() dto: CreateComplaintDto, @CurrentUser() u: AuthenticatedUser) {
    return this.svc.createComplaint(dto, u.sub);
  }

  @Get('complaints')
  @ApiOperation({ summary: 'List complaints with optional status/customer filter' })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'customerId', required: false, type: Number })
  findAllComplaints(
    @Query() dto: PaginationDto,
    @Query('status') status?: string,
    @Query('customerId') customerId?: number,
  ) {
    return this.svc.findAllComplaints(dto, status, customerId ? Number(customerId) : undefined);
  }

  @Get('complaints/:id')
  @ApiOperation({ summary: 'Get complaint details' })
  findOneComplaint(@Param('id', ParseIntPipe) id: number) {
    return this.svc.findOneComplaint(id);
  }

  @Patch('complaints/:id')
  @Roles(Role.CRM_SUPPORT, Role.SALES_MANAGER, Role.DEVELOPER_ADMIN)
  @ApiOperation({ summary: 'Update complaint status or priority' })
  updateComplaint(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateComplaintDto,
    @CurrentUser() u: AuthenticatedUser,
  ) {
    return this.svc.updateComplaint(id, dto, u.sub);
  }

  @Post('follow-ups')
  @Roles(Role.CRM_SUPPORT, Role.SALES_STAFF, Role.SALES_MANAGER, Role.DEVELOPER_ADMIN)
  @ApiOperation({ summary: 'Create a new follow-up for a lead' })
  createFollowUp(
    @Body() dto: { leadId: number; date: string; type: string; notes?: string },
    @CurrentUser() u: AuthenticatedUser,
  ) {
    return this.svc.createFollowUp({
      leadId: dto.leadId,
      date: new Date(dto.date),
      type: dto.type,
      notes: dto.notes,
    }, u.sub);
  }
}

