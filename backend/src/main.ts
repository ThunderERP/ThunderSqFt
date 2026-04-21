import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ── Global prefix ─────────────────────────────────────────────────────────
  app.setGlobalPrefix('api');

  // ── API Versioning ────────────────────────────────────────────────────────
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });

  // ── Global exception filter (consistent error shape) ──────────────────────
  app.useGlobalFilters(new HttpExceptionFilter());

  // ── Global response wrapper ───────────────────────────────────────────────
  app.useGlobalInterceptors(new TransformInterceptor());

  // ── Validation ────────────────────────────────────────────────────────────
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // ── CORS ──────────────────────────────────────────────────────────────────
  app.enableCors({
    origin: ['http://localhost:5174'],
    credentials: true,
  });

  // ── Swagger ───────────────────────────────────────────────────────────────
  const config = new DocumentBuilder()
    .setTitle('ThunderERP API')
    .setDescription(
      'Complete REST API for ThunderERP — Finance, CRM, Sales, Procurement, Inventory',
    )
    .setVersion('1.0')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'JWT-auth')
    .addTag('Auth', 'Authentication & authorization')
    .addTag('Users', 'User management')
    .addTag('Customers', 'Customer records')
    .addTag('Suppliers', 'Supplier management')
    .addTag('Products', 'Product master data')
    .addTag('Inventory', 'Stock management & movements')
    .addTag('Orders', 'Sales orders & processing')
    .addTag('Invoices', 'Invoice management')
    .addTag('Payments', 'Payment recording')
    .addTag('Purchases', 'Procurement workflow')
    .addTag('Returns', 'Return & refund handling')
    .addTag('CRM', 'Leads & complaints')
    .addTag('Finance', 'Financial reporting')
    .addTag('Audit', 'Audit log access')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: { persistAuthorization: true },
  });

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`ThunderERP API running on http://localhost:${port}/api`);
  console.log(`Swagger docs at http://localhost:${port}/api/docs`);
}

bootstrap();
