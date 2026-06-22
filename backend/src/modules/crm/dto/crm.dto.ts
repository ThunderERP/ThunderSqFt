// src/modules/crm/dto/crm.dto.ts
import {
  IsEmail, IsEnum, IsInt, IsOptional, IsPositive, IsString, MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';

// ─── Lead DTOs ────────────────────────────────────────────────────────────────

export type LeadStatus = 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'CONVERTED' | 'LOST';
export type LeadSource = 'WEBSITE' | 'REFERRAL' | 'COLD_CALL' | 'SOCIAL_MEDIA' | 'OTHER';

export class CreateLeadDto {
  @ApiProperty({ example: 'Priya Patel' })
  @IsString() @MinLength(2) name: string;

  @ApiPropertyOptional() @IsOptional() @IsString() phone?: string;
  @ApiPropertyOptional() @IsOptional() @IsEmail() email?: string;

  @ApiPropertyOptional({ example: 'REFERRAL' })
  @IsOptional() @IsString() source?: string;

  @ApiPropertyOptional() @IsOptional() @IsString() notes?: string;

  @ApiPropertyOptional({ description: 'User ID to assign this lead to' })
  @IsOptional() @Type(() => Number) @IsInt() @IsPositive() assignedTo?: number;
}

export class UpdateLeadDto extends PartialType(CreateLeadDto) {
  @ApiPropertyOptional({ example: 'CONTACTED' })
  @IsOptional() @IsString() status?: string;
}

export class ConvertLeadDto {
  @ApiPropertyOptional({ description: 'Link to existing customer instead of creating new' })
  @IsOptional() @Type(() => Number) @IsInt() @IsPositive() existingCustomerId?: number;
}

// ─── Complaint DTOs ───────────────────────────────────────────────────────────

export class CreateComplaintDto {
  @ApiProperty() @Type(() => Number) @IsInt() @IsPositive() customerId: number;
  @ApiProperty() @IsString() @MinLength(5) subject: string;
  @ApiProperty() @IsString() @MinLength(10) description: string;

  @ApiPropertyOptional({ example: 'HIGH', enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'] })
  @IsOptional() @IsString() priority?: string = 'MEDIUM';
}

export class UpdateComplaintDto {
  @ApiPropertyOptional({ example: 'IN_PROGRESS' })
  @IsOptional() @IsString() status?: string;

  @ApiPropertyOptional({ example: 'URGENT' })
  @IsOptional() @IsString() priority?: string;

  @ApiPropertyOptional() @IsOptional() @IsString() notes?: string;
}
