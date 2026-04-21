// src/modules/customers/customers.controller.ts
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { CustomersService } from './customers.service';
import { CreateCustomerDto, UpdateCustomerDto } from './dto/customer.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../common/types/request.types';
import { Role } from '@prisma/client';

@ApiTags('Customers')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('customers')
export class CustomersController {
  constructor(private customersService: CustomersService) {}

  @Post()
  @Roles(Role.SALES_STAFF, Role.SALES_MANAGER, Role.CRM_SUPPORT, Role.DEVELOPER_ADMIN)
  @ApiOperation({ summary: 'Create a new customer record' })
  create(@Body() dto: CreateCustomerDto, @CurrentUser() user: AuthenticatedUser) {
    return this.customersService.create(dto, user.sub);
  }

  @Get()
  @ApiOperation({ summary: 'List all customers with optional search' })
  @ApiQuery({ name: 'search', required: false })
  findAll(@Query() dto: PaginationDto, @Query('search') search?: string) {
    return this.customersService.findAll(dto, search);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get customer by ID with recent orders' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.customersService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.SALES_STAFF, Role.SALES_MANAGER, Role.CRM_SUPPORT, Role.DEVELOPER_ADMIN)
  @ApiOperation({ summary: 'Update customer details' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCustomerDto) {
    return this.customersService.update(id, dto);
  }

  @Delete(':id')
  @Roles(Role.SALES_MANAGER, Role.DEVELOPER_ADMIN)
  @ApiOperation({ summary: 'Soft-delete a customer' })
  remove(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: AuthenticatedUser) {
    return this.customersService.remove(id, user.sub);
  }
}
