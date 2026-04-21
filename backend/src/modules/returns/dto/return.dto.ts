// src/modules/returns/dto/return.dto.ts
import { IsEnum, IsInt, IsPositive, IsString, IsOptional, IsNumber, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ReturnType, ReturnStatus } from '@prisma/client';
import { Type } from 'class-transformer';

export class CreateReturnDto {
  @ApiProperty({ description: 'Order ID to return against' })
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  orderId: number;

  @ApiProperty({ description: 'Product ID being returned' })
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  productId: number;

  @ApiProperty()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  quantity: number;

  @ApiProperty({
    enum: ReturnType,
    description: 'REFUND (finance impact), RETURN (inventory impact), REPLACEMENT (outward)',
  })
  @IsEnum(ReturnType)
  type: ReturnType;

  @ApiProperty({ example: 'Product arrived damaged' })
  @IsString()
  reason: string;
}

export class ProcessReturnDto {
  @ApiProperty({ enum: [ReturnStatus.APPROVED, ReturnStatus.REJECTED] })
  @IsEnum(ReturnStatus)
  status: ReturnStatus;

  @ApiPropertyOptional({ description: 'Refund amount (required if REFUND type and APPROVED)' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  refundAmount?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}
