// src/modules/inventory/inventory.controller.ts
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
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { InventoryService } from './inventory.service';
import { AdjustStockDto, UpdateReorderLevelDto } from './dto/inventory.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../common/types/request.types';
import { Role } from '@prisma/client';

@ApiTags('Inventory')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('inventory')
export class InventoryController {
  constructor(private svc: InventoryService) {}

  @Get()
  @ApiOperation({ summary: 'List all inventory records with product details' })
  findAll(@Query() dto: PaginationDto) {
    return this.svc.findAll(dto);
  }

  @Get('low-stock')
  @Roles(Role.INVENTORY_MANAGER, Role.BUSINESS_OWNER, Role.DEVELOPER_ADMIN)
  @ApiOperation({ summary: 'Products at or below reorder level' })
  getLowStock() {
    return this.svc.getLowStockRaw();
  }

  @Get('product/:productId')
  @ApiOperation({ summary: 'Get inventory for a specific product' })
  findOne(@Param('productId', ParseIntPipe) productId: number) {
    return this.svc.findOne(productId);
  }

  @Get('product/:productId/movements')
  @ApiOperation({ summary: 'Stock movement history for a product' })
  getMovements(@Param('productId', ParseIntPipe) productId: number, @Query() dto: PaginationDto) {
    return this.svc.getMovements(productId, dto);
  }

  @Patch('product/:productId/adjust')
  @Roles(Role.INVENTORY_MANAGER, Role.DEVELOPER_ADMIN)
  @ApiOperation({ summary: 'Manual stock adjustment (positive = add, negative = remove)' })
  adjustStock(
    @Param('productId', ParseIntPipe) productId: number,
    @Body() dto: AdjustStockDto,
    @CurrentUser() u: AuthenticatedUser,
  ) {
    return this.svc.adjustStock(productId, dto, u.sub);
  }

  @Patch('product/:productId/reorder-level')
  @Roles(Role.INVENTORY_MANAGER, Role.DEVELOPER_ADMIN)
  @ApiOperation({ summary: 'Update reorder level for a product' })
  updateReorderLevel(
    @Param('productId', ParseIntPipe) productId: number,
    @Body() dto: UpdateReorderLevelDto,
  ) {
    return this.svc.updateReorderLevel(productId, dto);
  }
}
