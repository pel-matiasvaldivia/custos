import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TenantMiddleware } from './common/middleware/tenant.middleware';
import { TrialGuard } from './common/guards/trial.guard';
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
import { StorageModule } from './storage/storage.module';
import { HerramientaModule } from './herramienta/herramienta.module';
import { CatalogoModule } from './catalogo/catalogo.module';
import { ObjetivoModule } from './objetivo/objetivo.module';
import { VehiculoModule } from './vehiculo/vehiculo.module';
import { ContratoModule } from './contrato/contrato.module';
import { ClienteModule } from './cliente/cliente.module';
import { ContratoConfigModule } from './contrato-config/contrato-config.module';
import { RelevosModule } from './modules/relevos/relevos.module';
import { LiquidacionesModule } from './modules/liquidaciones/liquidaciones.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { VigilanteAuthModule } from './modules/vigilante-auth/vigilante-auth.module';
import { SuscripcionModule } from './modules/suscripcion/suscripcion.module';
import { UsuariosModule } from './usuarios/usuarios.module';

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
    StorageModule,
    HerramientaModule,
    CatalogoModule,
    ObjetivoModule,
    VehiculoModule,
    ContratoModule,
    ClienteModule,
    ContratoConfigModule,
    RelevosModule,
    LiquidacionesModule,
    DashboardModule,
    VigilanteAuthModule,
    SuscripcionModule,
    UsuariosModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: TrialGuard },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenantMiddleware).forRoutes('*');
  }
}
