import { Module } from '@nestjs/common';
import { TenantService } from './tenant.service';
import { TenantController } from './tenant.controller';
import { MiTenantController } from './mi-tenant.controller';
import { ReglasLaboralesController } from './reglas-laborales.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TenantController, MiTenantController, ReglasLaboralesController],
  providers: [TenantService],
  exports: [TenantService],
})
export class TenantModule {}
