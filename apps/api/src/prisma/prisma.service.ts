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

    // Add extension to set app.current_tenant on every query
    this.$use(async (params, next) => {
      const tenantId = this.tenantContext.getTenantId();
      if (tenantId) {
        await this.$executeRawUnsafe(`SET app.current_tenant = '${tenantId}'`);
      }
      return next(params);
    });
  }
}
