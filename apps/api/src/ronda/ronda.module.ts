import { Module } from '@nestjs/common';
import { RondaService } from './ronda.service';
import { RondaVigilanciaService } from './ronda-vigilancia.service';
import { RondaController } from './ronda.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { CentroOperacionesModule } from '../modules/centro-operaciones/centro-operaciones.module';

@Module({
  imports: [PrismaModule, CentroOperacionesModule],
  controllers: [RondaController],
  providers: [RondaService, RondaVigilanciaService],
  exports: [RondaService, RondaVigilanciaService],
})
export class RondaModule {}
