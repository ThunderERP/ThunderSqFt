// src/modules/users/users.controller.ts
import { Controller, Get, Patch, Param, Body, Query, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('Users')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @Roles(Role.DEVELOPER_ADMIN, Role.BUSINESS_OWNER)
  @ApiOperation({ summary: 'List all users' })
  findAll(@Query() dto: PaginationDto) { return this.usersService.findAll(dto); }

  @Get(':id')
  @Roles(Role.DEVELOPER_ADMIN, Role.BUSINESS_OWNER)
  @ApiOperation({ summary: 'Get a user by ID' })
  findOne(@Param('id', ParseIntPipe) id: number) { return this.usersService.findOne(id); }

  @Patch(':id')
  @Roles(Role.DEVELOPER_ADMIN)
  @ApiOperation({ summary: 'Update a user (Developer Admin only)' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUserDto) {
    return this.usersService.update(id, dto);
  }

  @Patch(':id/deactivate')
  @Roles(Role.DEVELOPER_ADMIN)
  @ApiOperation({ summary: 'Deactivate a user account' })
  deactivate(@Param('id', ParseIntPipe) id: number) { return this.usersService.deactivate(id); }

  @Patch(':id/activate')
  @Roles(Role.DEVELOPER_ADMIN)
  @ApiOperation({ summary: 'Activate a user account' })
  activate(@Param('id', ParseIntPipe) id: number) { return this.usersService.activate(id); }
}
