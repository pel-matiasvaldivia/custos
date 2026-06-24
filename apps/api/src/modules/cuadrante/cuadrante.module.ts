import { Module } from '@nestjs/common';
import { CuadranteService } from './cuadrante.service';
import { CuadranteController } from './cuadrante.controller';

@Module({
  controllers: [CuadranteController],
  providers: [CuadranteService],
  exports: [CuadranteService],
})
export class CuadranteModule {}
