import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';

export type AccionAuditoria =
  | 'CREAR'
  | 'EDITAR'
  | 'APROBAR'
  | 'ANULAR'
  | 'CERRAR'
  | 'REABRIR';

export interface RegistroAuditoria {
  tenantId: string;
  actorId: string;
  entidad: string; // 'ordenes_compra', 'cotizaciones', ...
  entidadId: string;
  accion: AccionAuditoria;
  antes?: unknown;
  despues?: unknown;
}

/**
 * Registro inmutable de acciones sensibles (spec: aprobación/anulación de OC,
 * edición de cotización, cierre/reapertura de período, baja de vehículo,
 * alta/edición de credencial, cambios de rol).
 *
 * Nunca debe romper la operación de negocio: si la escritura de auditoría falla,
 * se loguea pero no se propaga la excepción.
 */
@Injectable()
export class AuditoriaService {
  private readonly logger = new Logger(AuditoriaService.name);

  constructor(private prisma: PrismaService) {}

  async registrar(r: RegistroAuditoria): Promise<void> {
    try {
      await this.prisma.auditoria.create({
        data: {
          tenant_id: r.tenantId,
          actor_id: r.actorId,
          entidad: r.entidad,
          entidad_id: r.entidadId,
          accion: r.accion,
          antes: (r.antes ?? Prisma.JsonNull) as Prisma.InputJsonValue,
          despues: (r.despues ?? Prisma.JsonNull) as Prisma.InputJsonValue,
        },
      });
    } catch (e) {
      this.logger.error(
        `No se pudo registrar auditoría (${r.entidad}/${r.accion}): ${e}`,
      );
    }
  }
}
