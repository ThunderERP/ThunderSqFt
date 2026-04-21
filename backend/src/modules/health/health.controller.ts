// src/modules/health/health.controller.ts
// Public endpoint — intentionally no JwtAuthGuard.
// Used by Docker healthcheck and CI smoke tests.
import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PrismaService } from '../../prisma/prisma.service';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(private prisma: PrismaService) {}

  @Get()
  @ApiOperation({ summary: 'Liveness probe — no auth required' })
  async check() {
    await this.prisma.$queryRaw`SELECT 1`;
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: 'connected',
      version: process.env.npm_package_version ?? '1.0.0',
    };
  }
}
