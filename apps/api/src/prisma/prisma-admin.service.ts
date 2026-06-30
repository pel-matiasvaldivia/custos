import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

/**
 * Cliente Prisma con rol admin (MIGRATE_DATABASE_URL): OMITE Row-Level Security.
 *
 * Úsese SOLO para operaciones legítimamente cross-tenant que no tienen contexto
 * de tenant y que de otro modo RLS bloquearía:
 *   - Autenticación: lookup de usuario por email global (pre-auth).
 *   - Jobs de fan-out: escaneo diario de vencimientos sobre todas las empresas.
 *   - Receptor SIA: resolución dispositivo→tenant y alta de eventos entrantes.
 *
 * Estas operaciones fijan `tenant_id` explícitamente en cada filtro/escritura, así
 * que el aislamiento se mantiene por código. Para TODO lo demás (request-scoped),
 * usar PrismaService, que aplica RLS.
 */
@Injectable()
export class PrismaAdminService
  extends PrismaClient
  implements OnModuleDestroy
{
  constructor() {
    super({
      datasources: {
        db: {
          url: process.env.MIGRATE_DATABASE_URL || process.env.DATABASE_URL,
        },
      },
    });
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
