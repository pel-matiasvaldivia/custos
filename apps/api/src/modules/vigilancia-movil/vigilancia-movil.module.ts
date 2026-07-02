import { Module } from '@nestjs/common';
import { VigilanciaMovilService } from './vigilancia-movil.service';
import { VigilanciaMovilController } from './vigilancia-movil.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { CentroOperacionesModule } from '../centro-operaciones/centro-operaciones.module';
import { VigilanteAuthModule } from '../vigilante-auth/vigilante-auth.module';
import { RelevosModule } from '../relevos/relevos.module';
import { CatalogoModule } from '../../catalogo/catalogo.module';
import { StorageModule } from '../../storage/storage.module';

@Module({
  imports: [
    PrismaModule,
    CentroOperacionesModule,
    VigilanteAuthModule,
    RelevosModule,
    CatalogoModule,
    StorageModule,
  ],
  controllers: [VigilanciaMovilController],
  providers: [VigilanciaMovilService],
})
export class VigilanciaMovilModule {}
