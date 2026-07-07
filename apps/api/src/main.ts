import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import * as jwt from 'jsonwebtoken';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { GlobalExceptionFilter } from './common/filters/http-exception.filter';
import { getJwtSecret } from './common/config/jwt.config';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Cadena de proxies del despliegue: Nginx Proxy Manager → nginx del
  // contenedor web → API. Con 2 saltos confiables, req.ip es la IP real del
  // cliente (la que agregó NPM al X-Forwarded-For), no la IP pública compartida.
  app.set('trust proxy', Number(process.env.TRUST_PROXY_HOPS ?? 2));

  // Increase body size limit for contract/quote document HTML payloads
  app.use(require('express').json({ limit: '10mb' }));
  app.use(require('express').urlencoded({ extended: true, limit: '10mb' }));
  // Cuerpos crudos de texto: SDP de la señalización WHEP (video verificación) y
  // XML del Alarm Server de Hikvision cuando el equipo POSTea sin multipart.
  app.use(
    require('express').text({
      type: ['application/sdp', 'text/plain', 'application/xml', 'text/xml'],
      limit: '2mb',
    }),
  );

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

  // ─── Rate limiting pensado para una sola IP pública compartida ───
  // Toda la operación (oficina + celulares de guardias + tracking GPS) sale por
  // el mismo NAT/proxy, así que limitar por IP estrangula el servicio. La clave
  // de cuota es el usuario/vigilador del JWT (verificado, no forjable); la IP
  // solo se usa para tráfico anónimo.
  const clavePorUsuario = (req: {
    headers: Record<string, string | string[] | undefined>;
    ip?: string;
  }): string => {
    const auth = req.headers.authorization;
    if (typeof auth === 'string' && auth.startsWith('Bearer ')) {
      try {
        const decoded: any = jwt.verify(auth.slice(7), getJwtSecret());
        const sujeto = decoded?.vigiladorId ?? decoded?.sub;
        if (sujeto) return `u:${sujeto}`;
      } catch {
        // token inválido/expirado → se limita por IP como anónimo
      }
    }
    return `ip:${req.ip ?? 'unknown'}`;
  };

  // Cuota general: 600 req/min por usuario o IP anónima. Un guardia activo
  // (tracking cada 5s + rondas + novedades) usa ~20 req/min: hay margen 30x.
  app.use(
    rateLimit({
      windowMs: 60 * 1000,
      max: Number(process.env.RATE_LIMIT_MAX ?? 600),
      keyGenerator: clavePorUsuario,
      message:
        'Demasiadas solicitudes, por favor intente de nuevo en unos segundos.',
      standardHeaders: true,
      legacyHeaders: false,
    }),
  );

  // Logins: acá sí conviene ser estricto (fuerza bruta de PIN/contraseña),
  // pero por IP+identificador para que un cambio de turno con muchos guardias
  // detrás del mismo NAT no bloquee a los demás.
  const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: Number(process.env.LOGIN_RATE_LIMIT_MAX ?? 10),
    keyGenerator: (req: { ip?: string; body?: Record<string, unknown> }) =>
      `login:${req.ip ?? 'unknown'}:${req.body?.legajo_nro ?? req.body?.email ?? ''}`,
    message: 'Demasiados intentos de acceso. Esperá unos minutos y reintentá.',
    standardHeaders: true,
    legacyHeaders: false,
  });
  app.use('/api/v1/auth/login', loginLimiter);
  app.use('/api/v1/mobile/auth/login', loginLimiter);

  // Global exception filter for consistent error responses
  app.useGlobalFilters(new GlobalExceptionFilter());

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
