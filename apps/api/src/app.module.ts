import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { VigilanteModule } from './vigilante/vigilante.module';
import { CredencialModule } from './credencial/credencial.module';
import { PuestoModule } from './puesto/puesto.module';
import { AsignacionModule } from './asignacion/asignacion.module';
import { FeriadoModule } from './feriado/feriado.module';
import { CostosModule } from './costos/costos.module';
import { CotizacionModule } from './cotizacion/cotizacion.module';
import { NovedadModule } from './novedad/novedad.module';
import { RondaModule } from './ronda/ronda.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    VigilanteModule,
    CredencialModule,
    PuestoModule,
    AsignacionModule,
    FeriadoModule,
    CostosModule,
    CotizacionModule,
    NovedadModule,
    RondaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
