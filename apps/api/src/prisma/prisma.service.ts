import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { TenantContextService } from '../common/context/tenant-context.service';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor(private readonly tenantContext: TenantContextService) {
    super();
  }

  async onModuleInit() {
    await this.$connect();
  }

  async $connect() {
    await super.$connect();

    // Setea app.current_tenant en cada query para las políticas RLS.
    // Usa set_config parametrizado (no interpola SQL → sin inyección).
    // NOTA: con pool de conexiones esto NO es transaccional; para que RLS sea
    // realmente confiable hace falta envolver cada operación en una transacción
    // con set_config(..., true) (LOCAL). Ver TODO de seguridad en el README.
    this.$use(async (params, next) => {
      const tenantId = this.tenantContext.getTenantId();
      if (tenantId) {
        await this.$executeRaw`SELECT set_config('app.current_tenant', ${tenantId}, false)`;
      }
      return next(params);
    });
  }
}
