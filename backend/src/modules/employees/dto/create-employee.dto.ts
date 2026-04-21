import { IsString, IsEmail, IsOptional, IsEnum, IsNumber, Min } from 'class-validator';
import { Department } from '@prisma/client';

export class CreateEmployeeDto {
  @IsString()
  name: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsEnum(Department)
  department: Department;

  @IsNumber()
  @Min(0)
  basicSalary: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  allowances?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  deductions?: number;
}
