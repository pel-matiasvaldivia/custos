import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Global API prefix
  app.setGlobalPrefix('api/v1');

  // CORS configuration (restrict to allowed frontend)
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Security middlewares
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
        },
      },
    }),
  );

  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 100,
      message: 'Demasiadas solicitudes desde esta IP, por favor intente más tarde.',
      standardHeaders: true,
      legacyHeaders: false,
    }),
  );

  // Validation pipe with transformation and whitelist
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // Swagger documentation (expose at /api/v1/docs)
  const swaggerConfig = new DocumentBuilder()
    .setTitle('CustOS API')
    .setDescription('Documentación de la API de CustOS')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/v1/docs', app, document);

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`🚀 API listening on http://localhost:${port}/api/v1`);
}
bootstrap();
