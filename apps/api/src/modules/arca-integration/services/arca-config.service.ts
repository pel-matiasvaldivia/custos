import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { SecretosService } from '../../../common/crypto/secretos.service';
import { GuardarConfiguracionArcaDto } from '../dto/configuracion-arca.dto';
import { AmbienteArca } from '../arca.constants';
import { TicketAcceso } from '../arca.types';

export interface CredencialesArca {
  ambiente: AmbienteArca;
  cuit: string;
  certificadoPem: string;
  clavePem: string;
}

@Injectable()
export class ArcaConfigService {
  constructor(
    private prisma: PrismaService,
    private secretos: SecretosService,
  ) {}

  /** Config visible en el frontend: nunca expone el certificado ni la clave. */
  async obtenerParaVista(tenantId: string) {
    const cfg = await this.prisma.configuracionArca.findUnique({
      where: { tenant_id: tenantId },
    });
    return {
      configurado: !!cfg,
      ambiente: cfg?.ambiente ?? 'HOMOLOGACION',
      cuit_emisor: cfg?.cuit_emisor ?? null,
      condicion_iva: cfg?.condicion_iva ?? null,
      puntos_venta: cfg?.puntos_venta ?? [],
      tiene_certificado: !!cfg?.certificado_cifrado,
      tiene_clave: !!cfg?.clave_cifrada,
    };
  }

  async guardar(
    tenantId: string,
    dto: GuardarConfiguracionArcaDto,
    certificado?: Express.Multer.File,
    clave?: Express.Multer.File,
  ) {
    const data: Record<string, unknown> = {};
    if (dto.ambiente) data.ambiente = dto.ambiente;
    if (dto.cuit_emisor !== undefined) data.cuit_emisor = dto.cuit_emisor;
    if (dto.condicion_iva !== undefined) data.condicion_iva = dto.condicion_iva;
    if (dto.puntos_venta !== undefined) data.puntos_venta = dto.puntos_venta;

    if (certificado) {
      const pem = certificado.buffer.toString('utf8');
      if (!/-----BEGIN CERTIFICATE-----/.test(pem)) {
        throw new BadRequestException(
          'El certificado no parece un archivo .crt/.pem válido (falta el bloque BEGIN CERTIFICATE).',
        );
      }
      data.certificado_cifrado = this.secretos.cifrar(pem);
    }
    if (clave) {
      const pem = clave.buffer.toString('utf8');
      if (!/-----BEGIN (RSA |EC )?PRIVATE KEY-----/.test(pem)) {
        throw new BadRequestException(
          'La clave privada no parece un archivo .key/.pem válido (falta el bloque BEGIN PRIVATE KEY).',
        );
      }
      // Al rotar la clave o el certificado, el TA cacheado deja de servir.
      data.clave_cifrada = this.secretos.cifrar(pem);
      data.ta_token = null;
      data.ta_sign = null;
      data.ta_expira = null;
    }

    await this.prisma.configuracionArca.upsert({
      where: { tenant_id: tenantId },
      create: { tenant_id: tenantId, ...data },
      update: { ...data, updated_at: new Date() },
    });
    return this.obtenerParaVista(tenantId);
  }

  /** Credenciales descifradas para operar contra ARCA. Falla si falta algo. */
  async obtenerCredenciales(tenantId: string): Promise<CredencialesArca> {
    const cfg = await this.prisma.configuracionArca.findUnique({
      where: { tenant_id: tenantId },
    });
    if (!cfg) {
      throw new NotFoundException(
        'La empresa todavía no configuró la integración con ARCA.',
      );
    }
    if (!cfg.certificado_cifrado || !cfg.clave_cifrada) {
      throw new BadRequestException(
        'Faltan el certificado y/o la clave privada de ARCA. Subilos en Configuración → ARCA.',
      );
    }
    if (!cfg.cuit_emisor) {
      throw new BadRequestException(
        'Falta el CUIT del emisor en la configuración de ARCA.',
      );
    }
    return {
      ambiente: (cfg.ambiente as AmbienteArca) ?? 'HOMOLOGACION',
      cuit: cfg.cuit_emisor,
      certificadoPem: this.secretos.descifrar(cfg.certificado_cifrado),
      clavePem: this.secretos.descifrar(cfg.clave_cifrada),
    };
  }

  /** Respaldo en DB del último Ticket de Acceso (la fuente primaria es Redis). */
  async guardarTicket(tenantId: string, ta: TicketAcceso) {
    await this.prisma.configuracionArca.update({
      where: { tenant_id: tenantId },
      data: {
        ta_token: ta.token,
        ta_sign: ta.sign,
        ta_expira: new Date(ta.expira),
      },
    });
  }

  async obtenerTicketRespaldo(tenantId: string): Promise<TicketAcceso | null> {
    const cfg = await this.prisma.configuracionArca.findUnique({
      where: { tenant_id: tenantId },
    });
    if (!cfg?.ta_token || !cfg.ta_sign || !cfg.ta_expira) return null;
    return {
      token: cfg.ta_token,
      sign: cfg.ta_sign,
      expira: cfg.ta_expira.getTime(),
    };
  }
}
