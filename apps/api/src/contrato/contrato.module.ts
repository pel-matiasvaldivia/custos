import { Module } from '@nestjs/common';
import { ContratoController } from './contrato.controller';
import { ContratoService } from './contrato.service';
import { ContratoPdfService } from './contrato-pdf.service';
import { StorageModule } from '../storage/storage.module';
import { ContratoConfigModule } from '../contrato-config/contrato-config.module';

@Module({
  imports: [StorageModule, ContratoConfigModule],
  providers: [ContratoService, ContratoPdfService],
  controllers: [ContratoController],
  exports: [ContratoService],
})
export class ContratoModule {}
