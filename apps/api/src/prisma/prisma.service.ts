import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { TenantContextService } from '../common/context/tenant-context.service';

/**
 * Cada operación corre dentro de una transacción junto a `set_config(..., true)`
 * (LOCAL): el tenant queda atado a la conexión SOLO durante esa query. Es
 * atómico y no se filtra entre tenants bajo concurrencia ni queda pegado en
 * conexiones del pool. Sin contexto de tenant, la query corre sin scope y RLS
 * la bloquea (fail-closed).
 */
@Injectable()
export class PrismaService extends PrismaClient {
  constructor(tenantContext: TenantContextService) {
    super();
    const base = this;
    return this.$extends({
      query: {
        $allModels: {
          async $allOperations({ args, query }) {
            const tenantId = tenantContext.getTenantId();
            if (!tenantId) return query(args);
            const [, result] = await base.$transaction([
              base.$executeRaw`SELECT set_config('app.current_tenant', ${tenantId}, true)`,
              query(args),
            ] as any);
            return result;
          },
        },
      },
    }) as unknown as PrismaService;
  }
}
