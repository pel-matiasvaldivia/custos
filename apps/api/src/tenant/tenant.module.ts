import { Module } from '@nestjs/common';
import { TenantService } from './tenant.service';
import { TenantController } from './tenant.controller';
import { MiTenantController } from './mi-tenant.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TenantController, MiTenantController],
  providers: [TenantService],
  exports: [TenantService],
})
export class TenantModule {}
