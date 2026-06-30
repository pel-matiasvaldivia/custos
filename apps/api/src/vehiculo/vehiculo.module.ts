import { Module } from '@nestjs/common';
import { VehiculoController } from './vehiculo.controller';
import { VehiculoService } from './vehiculo.service';

@Module({
  providers: [VehiculoService],
  controllers: [VehiculoController],
  exports: [VehiculoService],
})
export class VehiculoModule {}
