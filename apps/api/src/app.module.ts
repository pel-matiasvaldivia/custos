import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TenantMiddleware } from './common/middleware/tenant.middleware';
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
import { ComprasModule } from './compras/compras.module';
import { TenantModule } from './tenant/tenant.module';
import { CentroOperacionesModule } from './modules/centro-operaciones/centro-operaciones.module';
import { ReportsModule } from './modules/reports/reports.module';
import { VigilanciaMovilModule } from './modules/vigilancia-movil/vigilancia-movil.module';
import { RentabilidadModule } from './modules/rentabilidad/rentabilidad.module';
import { AuditoriaModule } from './modules/auditoria/auditoria.module';
import { NotificacionesModule } from './modules/notificaciones/notificaciones.module';
import { FlotaModule } from './modules/flota/flota.module';
import { CuadranteModule } from './modules/cuadrante/cuadrante.module';

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
    ComprasModule,
    TenantModule,
    CentroOperacionesModule,
    ReportsModule,
    VigilanciaMovilModule,
    RentabilidadModule,
    AuditoriaModule,
    NotificacionesModule,
    FlotaModule,
    CuadranteModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenantMiddleware).forRoutes('*');
  }
}
