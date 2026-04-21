// src/modules/auth/dto/register.dto.ts
import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class RegisterDto {
  @ApiProperty({ example: 'Jane Doe' })
  @IsString()
  @MinLength(2)
  name: string;

  @ApiProperty({ example: 'jane@thundererp.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'StrongPass123' })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({ enum: Role, default: Role.SALES_STAFF })
  @IsEnum(Role)
  role: Role = Role.SALES_STAFF;
}
