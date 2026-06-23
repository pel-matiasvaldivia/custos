import { Module } from '@nestjs/common';
import { CentroOperacionesService } from './centro-operaciones.service';
import { CentroOperacionesController } from './centro-operaciones.controller';
import { COGateway } from './gateways/co.gateway';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CentroOperacionesController],
  providers: [CentroOperacionesService, COGateway],
  exports: [CentroOperacionesService, COGateway],
})
export class CentroOperacionesModule {}
