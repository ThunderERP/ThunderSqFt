// src/modules/products/dto/product.dto.ts
import {
  IsString,
  IsNumber,
  IsPositive,
  IsOptional,
  Min,
  Max,
  IsDateString,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @ApiProperty({ example: 'Widget Pro' })
  @IsString()
  @MinLength(2)
  name: string;

  @ApiPropertyOptional({ example: 'Electronics' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({ example: 'pcs', default: 'pcs' })
  @IsString()
  unit: string = 'pcs';

  @ApiProperty({ example: 499.99 })
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  price: number;

  @ApiProperty({ example: 18.0, description: 'GST percentage (0-100)' })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(100)
  gstPercentage: number;

  @ApiPropertyOptional({ example: 5.0, description: 'Discount percentage (0-100)' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(100)
  discountPercentage?: number = 0;

  @ApiPropertyOptional({ example: '2026-12-31' })
  @IsOptional()
  @IsDateString()
  expiryDate?: string;

  @ApiPropertyOptional({ example: '2024-01-01' })
  @IsOptional()
  @IsDateString()
  manufacturingDate?: string;
}

export class UpdateProductDto extends PartialType(CreateProductDto) {}
