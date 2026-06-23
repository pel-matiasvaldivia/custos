import { Module } from '@nestjs/common';
import { VigilanciaMovilService } from './vigilancia-movil.service';
import { VigilanciaMovilController } from './vigilancia-movil.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { CentroOperacionesModule } from '../centro-operaciones/centro-operaciones.module';

@Module({
  imports: [PrismaModule, CentroOperacionesModule],
  controllers: [VigilanciaMovilController],
  providers: [VigilanciaMovilService],
})
export class VigilanciaMovilModule {}
