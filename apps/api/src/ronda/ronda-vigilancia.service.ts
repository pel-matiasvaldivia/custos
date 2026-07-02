import { Injectable, Logger } from '@nestjs/common';
import { PrismaAdminService } from '../prisma/prisma-admin.service';
import { COGateway } from '../modules/centro-operaciones/gateways/co.gateway';

const ROLES_CO = ['ADMIN', 'GERENCIA', 'SUPERVISOR', 'OPERADOR'];
/** Sin plantilla ni turno de referencia, una ronda en progreso caduca a las 24h. */
const EXPIRACION_FALLBACK_MS = 24 * 60 * 60 * 1000;

type MotivoCierre = 'TOLERANCIA_VENCIDA' | 'TURNO_FINALIZADO' | 'EXPIRADA';

/**
 * Watcher de rondas en progreso (job repetible `vigilar-rondas`, cada minuto).
 *
 * Cierra como INCOMPLETA toda ronda que:
 *  - superó la tolerancia configurada en su plantilla (tolerancia_min), o
 *  - siguió abierta después de que terminó el turno del vigilador, o
 *  - lleva más de 24h abierta sin otra referencia.
 *
 * Cada cierre emite `ronda.alerta` al Centro de Operaciones; los vencimientos
 * por tolerancia generan además una notificación in-app a los roles operativos.
 *
 * Corre cross-tenant con PrismaAdminService (bypass RLS): cada filtro y
 * escritura fija tenant_id explícitamente, como el resto de los jobs fan-out.
 */
@Injectable()
export class RondaVigilanciaService {
  private readonly logger = new Logger(RondaVigilanciaService.name);

  constructor(
    private readonly prismaAdmin: PrismaAdminService,
    private readonly coGateway: COGateway,
  ) {}

  async vigilarRondas(): Promise<{ cerradas: number }> {
    const ahora = new Date();
    const enProgreso = await this.prismaAdmin.ronda.findMany({
      where: { estado: 'EN_PROGRESO' },
      include: {
        plantilla: { select: { nombre: true, tolerancia_min: true } },
        vigilador: { select: { id: true, nombre: true, apellido: true } },
        puesto: { select: { id: true, nombre: true, objetivo_id: true } },
        marcas: { select: { id: true } },
      },
    });

    let cerradas = 0;
    for (const ronda of enProgreso) {
      const motivo = await this.motivoCierre(ronda, ahora);
      if (!motivo) continue;
      await this.cerrarRonda(ronda, motivo, ahora);
      cerradas += 1;
    }
    return { cerradas };
  }

  private async motivoCierre(
    ronda: {
      tenant_id: string;
      vigilador_id: string;
      hora_inicio: Date;
      plantilla: { tolerancia_min: number | null } | null;
    },
    ahora: Date,
  ): Promise<MotivoCierre | null> {
    const tolerancia = ronda.plantilla?.tolerancia_min;
    if (
      tolerancia &&
      ahora.getTime() - ronda.hora_inicio.getTime() > tolerancia * 60_000
    ) {
      return 'TOLERANCIA_VENCIDA';
    }

    // Turno dentro del cual arrancó la ronda: si ya terminó, la ronda se cierra.
    const turno = await this.prismaAdmin.turnoPlanificado.findFirst({
      where: {
        tenant_id: ronda.tenant_id,
        vigilador_id: ronda.vigilador_id,
        inicio_plan: { lte: ronda.hora_inicio },
        fin_plan: { gte: ronda.hora_inicio },
      },
      select: { fin_plan: true },
      orderBy: { fin_plan: 'desc' },
    });
    if (turno && turno.fin_plan < ahora) return 'TURNO_FINALIZADO';

    if (
      !turno &&
      !tolerancia &&
      ahora.getTime() - ronda.hora_inicio.getTime() > EXPIRACION_FALLBACK_MS
    ) {
      return 'EXPIRADA';
    }
    return null;
  }

  private async cerrarRonda(
    ronda: {
      id: string;
      tenant_id: string;
      nombre: string;
      hora_inicio: Date;
      plantilla: { nombre: string; tolerancia_min: number | null } | null;
      vigilador: { id: string; nombre: string; apellido: string };
      puesto: { id: string; nombre: string; objetivo_id: string | null };
      marcas: { id: string }[];
    },
    motivo: MotivoCierre,
    ahora: Date,
  ) {
    await this.prismaAdmin.ronda.updateMany({
      where: {
        id: ronda.id,
        tenant_id: ronda.tenant_id,
        estado: 'EN_PROGRESO',
      },
      data: { estado: 'INCOMPLETA', hora_fin: ahora },
    });

    const payload = {
      ronda_id: ronda.id,
      ronda_nombre: ronda.plantilla?.nombre ?? ronda.nombre,
      motivo,
      vigilador_id: ronda.vigilador.id,
      vigilador_nombre: `${ronda.vigilador.apellido}, ${ronda.vigilador.nombre}`,
      puesto_id: ronda.puesto.id,
      puesto_nombre: ronda.puesto.nombre,
      objetivo_id: ronda.puesto.objetivo_id,
      hora_inicio: ronda.hora_inicio,
      tolerancia_min: ronda.plantilla?.tolerancia_min ?? null,
      puntos_marcados: ronda.marcas.length,
      ts: ahora,
    };
    this.coGateway.emitToTenant(ronda.tenant_id, 'ronda.alerta', payload);
    this.logger.warn(
      `Ronda ${ronda.id} (${payload.ronda_nombre}) cerrada INCOMPLETA por ${motivo}`,
    );

    // La tolerancia vencida es una falla de cumplimiento activa: además del
    // evento en vivo, queda una notificación para los roles operativos.
    if (motivo === 'TOLERANCIA_VENCIDA') {
      const destinatarios = await this.prismaAdmin.user.findMany({
        where: {
          tenant_id: ronda.tenant_id,
          role: { in: ROLES_CO },
          deleted_at: null,
        },
        select: { id: true },
      });
      if (destinatarios.length > 0) {
        await this.prismaAdmin.notificacion.createMany({
          data: destinatarios.map((d: { id: string }) => ({
            tenant_id: ronda.tenant_id,
            destinatario_id: d.id,
            tipo: 'RONDA_INCUMPLIDA',
            canal: 'IN_APP' as const,
            payload,
          })),
        });
      }
    }
  }
}
