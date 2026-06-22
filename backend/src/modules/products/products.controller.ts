// src/modules/products/products.controller.ts
import {
  Controller, Get, Post, Patch, Delete,
  Body, Param, Query, ParseIntPipe, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../common/types/request.types';
import { Role } from '@prisma/client';

@ApiTags('Products')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('products')
export class ProductsController {
  constructor(private svc: ProductsService) {}

  @Post()
  @Roles(Role.INVENTORY_MANAGER, Role.DEVELOPER_ADMIN)
  @ApiOperation({ summary: 'Create a product (auto-creates Inventory record)' })
  create(@Body() dto: CreateProductDto, @CurrentUser() u: AuthenticatedUser) {
    return this.svc.create(dto, u.sub);
  }

  @Get()
  @ApiOperation({ summary: 'List products with optional search and category filter' })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'category', required: false })
  findAll(
    @Query() dto: PaginationDto,
    @Query('search') search?: string,
    @Query('category') category?: string,
  ) {
    return this.svc.findAll(dto, search, category);
  }

  @Get('categories')
  @ApiOperation({ summary: 'Get all distinct product categories' })
  getCategories() { return this.svc.getCategories(); }

  @Get(':id')
  @ApiOperation({ summary: 'Get product with current inventory levels' })
  findOne(@Param('id', ParseIntPipe) id: number) { return this.svc.findOne(id); }

  @Patch(':id')
  @Roles(Role.INVENTORY_MANAGER, Role.DEVELOPER_ADMIN)
  @ApiOperation({ summary: 'Update product details' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProductDto) {
    return this.svc.update(id, dto);
  }

  @Delete(':id')
  @Roles(Role.INVENTORY_MANAGER, Role.DEVELOPER_ADMIN)
  @ApiOperation({ summary: 'Soft-delete a product' })
  remove(@Param('id', ParseIntPipe) id: number) { return this.svc.remove(id); }
}
