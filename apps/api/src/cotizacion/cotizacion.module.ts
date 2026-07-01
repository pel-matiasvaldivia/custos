import { Module } from '@nestjs/common';
import { CotizacionService } from './cotizacion.service';
import { CotizacionController } from './cotizacion.controller';
import { CotizacionPdfService } from './cotizacion-pdf.service';
import { PrismaModule } from '../prisma/prisma.module';
import { CostosModule } from '../costos/costos.module';
import { ContratoModule } from '../contrato/contrato.module';
import { ContratoConfigModule } from '../contrato-config/contrato-config.module';
import { StorageModule } from '../storage/storage.module';

@Module({
  imports: [PrismaModule, CostosModule, ContratoModule, ContratoConfigModule, StorageModule],
  controllers: [CotizacionController],
  providers: [CotizacionService, CotizacionPdfService],
})
export class CotizacionModule {}
