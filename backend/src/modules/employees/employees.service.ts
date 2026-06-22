import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

@Injectable()
export class EmployeesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateEmployeeDto, createdBy: number) {
    if (dto.email) {
      const exists = await this.prisma.employee.findUnique({ where: { email: dto.email } });
      if (exists) throw new ConflictException(`Email ${dto.email} already registered`);
    }

    // Generate EmployeeID
    const count = await this.prisma.employee.count();
    const employeeId = `EMP${String(count + 1).padStart(3, '0')}`;

    return this.prisma.employee.create({
      data: {
        ...dto,
        employeeId,
        createdBy,
      },
    });
  }

  async findAll() {
    return this.prisma.employee.findMany({
      where: { isActive: true },
      orderBy: { id: 'asc' },
    });
  }

  async findOne(id: number) {
    const employee = await this.prisma.employee.findUnique({
      where: { id },
    });

    if (!employee || !employee.isActive) {
      throw new NotFoundException(`Employee #${id} not found`);
    }
    return employee;
  }

  async update(id: number, dto: UpdateEmployeeDto) {
    await this.findOne(id);
    if (dto.email) {
      const conflict = await this.prisma.employee.findUnique({ where: { email: dto.email } });
      if (conflict && conflict.id !== id) {
        throw new ConflictException('Email already in use');
      }
    }
    return this.prisma.employee.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: number, userId: number) {
    await this.findOne(id);
    return this.prisma.employee.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
