import { Module } from '@nestjs/common';
import { ArcaIntegrationController } from './arca-integration.controller';
import { NominaService } from './services/nomina.service';
import { ArcaConfigService } from './services/arca-config.service';
import { WsaaService } from './services/wsaa.service';
import { WsfeService } from './services/wsfe.service';
import { FacturacionService } from './services/facturacion.service';
import { FacturaPdfService } from './services/factura-pdf.service';
import { SecretosService } from '../../common/crypto/secretos.service';

/**
 * Integración con ARCA (ex-AFIP): sincronización de personal por archivos planos
 * (nómina / LSD) y facturación electrónica en tiempo real (WSFEv1 con CAE).
 * PrismaService/PrismaAdminService llegan del PrismaModule global.
 */
@Module({
  controllers: [ArcaIntegrationController],
  providers: [
    NominaService,
    ArcaConfigService,
    WsaaService,
    WsfeService,
    FacturacionService,
    FacturaPdfService,
    SecretosService,
  ],
})
export class ArcaIntegrationModule {}
