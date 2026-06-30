import { Module } from '@nestjs/common';
import { CotizacionService } from './cotizacion.service';
import { CotizacionController } from './cotizacion.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { CostosModule } from '../costos/costos.module';
import { ContratoModule } from '../contrato/contrato.module';

@Module({
  imports: [PrismaModule, CostosModule, ContratoModule],
  controllers: [CotizacionController],
  providers: [CotizacionService],
})
export class CotizacionModule {}
