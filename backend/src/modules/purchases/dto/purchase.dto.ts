// src/modules/purchases/dto/purchase.dto.ts
import {
  IsInt, IsPositive, IsArray, ValidateNested,
  ArrayMinSize, IsOptional, IsString, IsDateString, IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PurchaseItemInputDto {
  @ApiProperty() @Type(() => Number) @IsInt() @IsPositive() productId: number;
  @ApiProperty() @Type(() => Number) @IsInt() @IsPositive() quantity: number;
  @ApiProperty() @Type(() => Number) @IsNumber() @IsPositive() unitPrice: number;
}

export class CreatePurchaseDto {
  @ApiProperty() @Type(() => Number) @IsInt() @IsPositive() supplierId: number;

  @ApiPropertyOptional() @IsOptional() @IsDateString() expectedDeliveryDate?: string;

  @ApiProperty({ type: [PurchaseItemInputDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PurchaseItemInputDto)
  @ArrayMinSize(1)
  items: PurchaseItemInputDto[];

  @ApiPropertyOptional() @IsOptional() @IsString() notes?: string;
}
