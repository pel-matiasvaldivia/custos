import { Module } from '@nestjs/common';
import { ContratoController } from './contrato.controller';
import { ContratoService } from './contrato.service';

@Module({
  providers: [ContratoService],
  controllers: [ContratoController],
  exports: [ContratoService],
})
export class ContratoModule {}
