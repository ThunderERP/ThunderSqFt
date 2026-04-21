// src/modules/payments/dto/payment.dto.ts
import { IsEnum, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaymentMethod } from '@prisma/client';
import { Type } from 'class-transformer';

export class CreatePaymentDto {
  @ApiProperty({ example: 1, description: 'Invoice ID this payment is for' })
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  invoiceId: number;

  @ApiProperty({ example: 5000.0 })
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  amount: number;

  @ApiProperty({ enum: PaymentMethod })
  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

  @ApiPropertyOptional({ example: 'UPI-TXN-12345' })
  @IsOptional()
  @IsString()
  referenceId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}
