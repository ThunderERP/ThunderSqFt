// src/modules/purchases/purchases.controller.ts
import {
  Controller, Get, Post, Patch, Body, Param,
  Query, ParseIntPipe, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { PurchasesService } from './purchases.service';
import { CreatePurchaseDto } from './dto/purchase.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../common/types/request.types';
import { Role, PurchaseStatus } from '@prisma/client';

@ApiTags('Purchases')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('purchases')
export class PurchasesController {
  constructor(private svc: PurchasesService) {}

  @Post()
  @Roles(Role.INVENTORY_MANAGER, Role.BUSINESS_OWNER, Role.DEVELOPER_ADMIN)
  @ApiOperation({ summary: 'Create a purchase order (status = PENDING)' })
  create(@Body() dto: CreatePurchaseDto, @CurrentUser() u: AuthenticatedUser) {
    return this.svc.create(dto, u.sub);
  }

  @Get()
  @ApiOperation({ summary: 'List all purchase orders' })
  @ApiQuery({ name: 'status', enum: PurchaseStatus, required: false })
  findAll(@Query() dto: PaginationDto, @Query('status') status?: PurchaseStatus) {
    return this.svc.findAll(dto, status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get purchase order details with items' })
  findOne(@Param('id', ParseIntPipe) id: number) { return this.svc.findOne(id); }

  @Patch(':id/approve')
  @Roles(Role.BUSINESS_OWNER, Role.DEVELOPER_ADMIN)
  @ApiOperation({
    summary: 'Approve a purchase order (Business Owner only)',
    description: 'SRS 4.2: Purchases must be approved before goods receipt.',
  })
  approve(@Param('id', ParseIntPipe) id: number, @CurrentUser() u: AuthenticatedUser) {
    return this.svc.approve(id, u.sub, u.role as Role);
  }

  @Patch(':id/receive')
  @Roles(Role.INVENTORY_MANAGER, Role.DEVELOPER_ADMIN)
  @ApiOperation({
    summary: 'Record goods receipt — increases available stock (Inward movement)',
    description: 'SRS 4.2: Creates INWARD stock movements for each item in the purchase.',
  })
  receiveGoods(@Param('id', ParseIntPipe) id: number, @CurrentUser() u: AuthenticatedUser) {
    return this.svc.receiveGoods(id, u.sub);
  }

  @Patch(':id/complete')
  @Roles(Role.INVENTORY_MANAGER, Role.BUSINESS_OWNER, Role.DEVELOPER_ADMIN)
  @ApiOperation({ summary: 'Mark purchase as completed' })
  complete(@Param('id', ParseIntPipe) id: number, @CurrentUser() u: AuthenticatedUser) {
    return this.svc.complete(id, u.sub);
  }
}
