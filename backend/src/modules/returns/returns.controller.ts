// src/modules/returns/returns.controller.ts
import {
  Controller, Get, Post, Patch, Body, Param,
  Query, ParseIntPipe, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { ReturnsService } from './returns.service';
import { CreateReturnDto, ProcessReturnDto } from './dto/return.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../common/types/request.types';
import { Role, ReturnStatus } from '@prisma/client';

@ApiTags('Returns')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('returns')
export class ReturnsController {
  constructor(private svc: ReturnsService) {}

  @Post()
  @Roles(Role.REFUND_HANDLER, Role.CRM_SUPPORT, Role.SALES_MANAGER, Role.DEVELOPER_ADMIN)
  @ApiOperation({
    summary: 'Initiate a return/refund/replacement request',
    description: 'SRS 4.4: Only allowed for DELIVERED/COMPLETED orders. Reason is mandatory.',
  })
  create(@Body() dto: CreateReturnDto, @CurrentUser() u: AuthenticatedUser) {
    return this.svc.create(dto, u.sub);
  }

  @Get()
  @ApiOperation({ summary: 'List all return requests' })
  @ApiQuery({ name: 'status', enum: ReturnStatus, required: false })
  findAll(@Query() dto: PaginationDto, @Query('status') status?: ReturnStatus) {
    return this.svc.findAll(dto, status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get return request details' })
  findOne(@Param('id', ParseIntPipe) id: number) { return this.svc.findOne(id); }

  @Patch(':id/process')
  @Roles(Role.REFUND_HANDLER, Role.FINANCE_MANAGER, Role.DEVELOPER_ADMIN)
  @ApiOperation({
    summary: 'Approve or reject a return request',
    description:
      'REFUND → finance impact (credit transaction). ' +
      'RETURN → stock comes back (inventory). ' +
      'REPLACEMENT → outward movement (new item sent). ',
  })
  process(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ProcessReturnDto,
    @CurrentUser() u: AuthenticatedUser,
  ) {
    return this.svc.process(id, dto, u.sub);
  }
}
