// src/modules/inventory/dto/inventory.dto.ts
import { IsInt, IsPositive, IsString, IsOptional, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class AdjustStockDto {
  @ApiProperty({ description: 'Positive to add stock, negative to remove' })
  @Type(() => Number)
  @IsInt()
  quantity: number;

  @ApiProperty({ example: 'Physical count correction' })
  @IsString()
  note: string;
}

export class UpdateReorderLevelDto {
  @ApiProperty({ example: 10 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  reorderLevel: number;
}

// Internal DTO used by OrdersService and PurchasesService
export class ReserveStockDto {
  productId: number;
  quantity: number;
  referenceId: number;
  referenceType: string;
  userId: number;
}

export class ReleaseStockDto {
  productId: number;
  quantity: number;
  referenceId: number;
  referenceType: string;
  userId: number;
}

export class DeductStockDto {
  productId: number;
  quantity: number;
  referenceId: number;
  referenceType: string;
  userId: number;
}

export class AddStockDto {
  productId: number;
  quantity: number;
  referenceId: number;
  referenceType: string;
  userId: number;
}
