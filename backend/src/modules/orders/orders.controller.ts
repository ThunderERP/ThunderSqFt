// src/modules/orders/orders.controller.ts
import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiBody } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto, OrderFilterDto } from './dto/order.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../common/types/request.types';
import { Role } from '@prisma/client';
import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

class CancelOrderDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  reason?: string;
}

class ShipOrderDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  address?: string;
}

@ApiTags('Orders')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('orders')
export class OrdersController {
  constructor(private svc: OrdersService) {}

  @Post()
  @Roles(Role.SALES_STAFF, Role.SALES_MANAGER, Role.DEVELOPER_ADMIN)
  @ApiOperation({ summary: 'Create a new sales order (status = PENDING)' })
  create(@Body() dto: CreateOrderDto, @CurrentUser() u: AuthenticatedUser) {
    return this.svc.create(dto, u.sub);
  }

  @Get()
  @ApiOperation({ summary: 'List orders with optional status/customer filter' })
  findAll(@Query() dto: PaginationDto, @Query() filter: OrderFilterDto) {
    return this.svc.findAll(dto, filter);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get full order details including items and invoice' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.svc.findOne(id);
  }

  @Patch(':id/confirm')
  @Roles(Role.SALES_STAFF, Role.SALES_MANAGER, Role.DEVELOPER_ADMIN)
  @ApiOperation({
    summary: 'Confirm order — triggers atomic stock reservation (SELECT FOR UPDATE)',
    description:
      'Locks inventory rows, validates availability, moves qty from available→reserved, generates invoice. ' +
      'Rolls back entirely if any product is out of stock.',
  })
  confirm(@Param('id', ParseIntPipe) id: number, @CurrentUser() u: AuthenticatedUser) {
    return this.svc.confirm(id, u.sub);
  }

  @Patch(':id/ship')
  @Roles(Role.SALES_STAFF, Role.SALES_MANAGER, Role.INVENTORY_MANAGER, Role.DEVELOPER_ADMIN)
  @ApiOperation({ summary: 'Mark order as shipped, creates tracking record' })
  @ApiBody({ type: ShipOrderDto })
  ship(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: ShipOrderDto,
    @CurrentUser() u: AuthenticatedUser,
  ) {
    return this.svc.ship(id, body.address ?? '', u.sub);
  }

  @Patch(':id/deliver')
  @Roles(Role.SALES_STAFF, Role.SALES_MANAGER, Role.INVENTORY_MANAGER, Role.DEVELOPER_ADMIN)
  @ApiOperation({ summary: 'Mark order as delivered — deducts stock from reserved' })
  deliver(@Param('id', ParseIntPipe) id: number, @CurrentUser() u: AuthenticatedUser) {
    return this.svc.deliver(id, u.sub);
  }

  @Patch(':id/complete')
  @Roles(Role.SALES_MANAGER, Role.DEVELOPER_ADMIN)
  @ApiOperation({ summary: 'Mark order as completed' })
  complete(@Param('id', ParseIntPipe) id: number, @CurrentUser() u: AuthenticatedUser) {
    return this.svc.complete(id, u.sub);
  }

  @Patch(':id/cancel')
  @Roles(Role.SALES_MANAGER, Role.DEVELOPER_ADMIN)
  @ApiOperation({
    summary: 'Cancel order — automatically releases reserved stock if confirmed',
  })
  @ApiBody({ type: CancelOrderDto })
  cancel(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: CancelOrderDto,
    @CurrentUser() u: AuthenticatedUser,
  ) {
    return this.svc.cancel(id, body.reason ?? 'Cancelled', u.sub);
  }
}
