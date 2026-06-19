import { Module } from '@nestjs/common';
import { PuestoService } from './puesto.service';
import { PuestoController } from './puesto.controller';

@Module({
  providers: [PuestoService],
  controllers: [PuestoController],
  exports: [PuestoService],
})
export class PuestoModule {}
