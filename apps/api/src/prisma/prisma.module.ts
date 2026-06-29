import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { PrismaAdminService } from './prisma-admin.service';
import { TenantContextService } from '../common/context/tenant-context.service';

@Global()
@Module({
  providers: [PrismaService, PrismaAdminService, TenantContextService],
  exports: [PrismaService, PrismaAdminService, TenantContextService],
})
export class PrismaModule {}
