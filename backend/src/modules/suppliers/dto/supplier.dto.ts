// src/modules/suppliers/dto/supplier.dto.ts
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';

export class CreateSupplierDto {
  @ApiProperty() @IsString() @MinLength(2) name: string;
  @ApiPropertyOptional() @IsOptional() @IsString() phone?: string;
  @ApiPropertyOptional() @IsOptional() @IsEmail() email?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() address?: string;
}
export class UpdateSupplierDto extends PartialType(CreateSupplierDto) {}
