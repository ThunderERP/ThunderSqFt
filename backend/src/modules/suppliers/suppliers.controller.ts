// src/modules/suppliers/suppliers.controller.ts
import {
  Controller, Get, Post, Patch, Delete, Body, Param,
  Query, ParseIntPipe, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { SuppliersService } from './suppliers.service';
import { CreateSupplierDto, UpdateSupplierDto } from './dto/supplier.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../common/types/request.types';
import { Role } from '@prisma/client';

@ApiTags('Suppliers')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('suppliers')
export class SuppliersController {
  constructor(private svc: SuppliersService) {}

  @Post()
  @Roles(Role.INVENTORY_MANAGER, Role.DEVELOPER_ADMIN)
  @ApiOperation({ summary: 'Add a new supplier' })
  create(@Body() dto: CreateSupplierDto, @CurrentUser() u: AuthenticatedUser) {
    return this.svc.create(dto, u.sub);
  }

  @Get()
  @ApiOperation({ summary: 'List all suppliers' })
  findAll(@Query() dto: PaginationDto, @Query('search') search?: string) {
    return this.svc.findAll(dto, search);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get supplier with purchase history' })
  findOne(@Param('id', ParseIntPipe) id: number) { return this.svc.findOne(id); }

  @Patch(':id')
  @Roles(Role.INVENTORY_MANAGER, Role.DEVELOPER_ADMIN)
  @ApiOperation({ summary: 'Update supplier' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateSupplierDto) {
    return this.svc.update(id, dto);
  }

  @Delete(':id')
  @Roles(Role.INVENTORY_MANAGER, Role.DEVELOPER_ADMIN)
  @ApiOperation({ summary: 'Soft-delete supplier' })
  remove(@Param('id', ParseIntPipe) id: number) { return this.svc.remove(id); }
}
