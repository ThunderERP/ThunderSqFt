// src/modules/customers/dto/create-customer.dto.ts
import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaymentMethod } from '@prisma/client';

export class CreateCustomerDto {
  @ApiProperty({ example: 'Ravi Sharma' })
  @IsString()
  @MinLength(2)
  name: string;

  @ApiProperty({ example: '9876543210' })
  @IsString()
  phone: string;

  @ApiPropertyOptional({ example: 'ravi@example.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional() @IsOptional() @IsString() address?: string;

  @ApiPropertyOptional({ enum: PaymentMethod })
  @IsOptional()
  @IsEnum(PaymentMethod)
  preferredPaymentMethod?: PaymentMethod;
}

// src/modules/customers/dto/update-customer.dto.ts
import { PartialType } from '@nestjs/swagger';
export class UpdateCustomerDto extends PartialType(CreateCustomerDto) {}
