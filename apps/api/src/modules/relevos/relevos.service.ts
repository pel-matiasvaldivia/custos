import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { COGateway } from '../centro-operaciones/gateways/co.gateway';
import {
  validarTurno,
  ReglasValidacion,
  TurnoRef,
} from '../cuadrante/validacion.domain';
import { SolicitarRelevoDto } from './dto/solicitar-relevo.dto';
import { AprobarRelevoDto } from './dto/aprobar-relevo.dto';

@Injectable()
export class RelevosService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly coGateway: COGateway,
  ) {}

  /**
   * El vigilador marca su propio turno futuro como pendiente de relevo:
   * no crea todavía una fila Relevo (eso requiere turno_relevo_id, que aún
   * no existe), sólo deja constancia en el turno original.
   */
  async solicitar(
    tenantId: string,
    vigiladorId: string,
    dto: SolicitarRelevoDto,
  ) {
    const turno = await this.prisma.turnoPlanificado.findFirst({
      where: { id: dto.turno_original_id, tenant_id: tenantId },
    });
    if (!turno) throw new NotFoundException('Turno no encontrado');
    if (turno.vigilador_id !== vigiladorId) {
      throw new ForbiddenException('El turno no pertenece a este vigilador');
    }
    if (!['PLANIFICADA', 'CONFIRMADA'].includes(turno.estado)) {
      throw new BadRequestException(
        'El turno no admite solicitud de relevo en su estado actual',
      );
    }
    if (turno.inicio_plan <= new Date()) {
      throw new BadRequestException(
        'No se puede solicitar relevo de un turno que ya comenzó',
      );
    }

    const actualizado = await this.prisma.turnoPlanificado.update({
      where: { id: turno.id },
      data: { estado: 'AUSENTE', motivo: dto.motivo ?? null },
    });

    this.coGateway.emitToTenant(tenantId, 'relevo.solicitado', {
      turnoId: turno.id,
      vigiladorId,
      motivo: dto.motivo ?? null,
      ts: new Date(),
    });

    return actualizado;
  }

  async pendientes(tenantId: string) {
    const turnos = await this.prisma.turnoPlanificado.findMany({
      where: { tenant_id: tenantId, estado: 'AUSENTE' },
      orderBy: { inicio_plan: 'asc' },
    });
    if (turnos.length === 0) return [];

    const [vigiladores, puestos] = await Promise.all([
      this.prisma.vigilador.findMany({
        where: {
          tenant_id: tenantId,
          id: { in: turnos.map((t) => t.vigilador_id) },
        },
        select: { id: true, nombre: true, apellido: true, legajo_nro: true },
      }),
      this.prisma.puesto.findMany({
        where: {
          tenant_id: tenantId,
          id: { in: turnos.map((t) => t.puesto_id) },
        },
        select: { id: true, nombre: true },
      }),
    ]);
    const vigiladorPorId = new Map(vigiladores.map((v) => [v.id, v]));
    const puestoPorId = new Map(puestos.map((p) => [p.id, p]));

    return turnos.map((t) => ({
      id: t.id,
      inicioPlan: t.inicio_plan,
      finPlan: t.fin_plan,
      motivo: t.motivo,
      vigiladorId: t.vigilador_id,
      vigilador: vigiladorPorId.get(t.vigilador_id) ?? null,
      puestoId: t.puesto_id,
      puestoNombre: puestoPorId.get(t.puesto_id)?.nombre ?? null,
    }));
  }

  /**
   * Vigiladores ACTIVO sin solapamiento ni violación de reglas duras frente
   * a sus propios turnos existentes. No filtra por credenciales requeridas
   * por puesto: ese concepto no existe hoy en el modelo (sólo credenciales
   * genéricas por vigilador).
   */
  async sugerirCandidatos(tenantId: string, turnoId: string) {
    const turno = await this.prisma.turnoPlanificado.findFirst({
      where: { id: turnoId, tenant_id: tenantId },
    });
    if (!turno) throw new NotFoundException('Turno no encontrado');

    const regla = await this.prisma.reglaLaboral.findUnique({
      where: { tenant_id: tenantId },
    });
    const reglas: ReglasValidacion = {
      jornadaMaxSemanalH: regla?.jornada_max_semanal_h ?? 48,
      descansoMinEntreJornadasH: regla?.descanso_min_entre_jornadas_h ?? 12,
      maxDiasConsecutivos: regla?.max_dias_consecutivos ?? 6,
    };

    const vigiladores = await this.prisma.vigilador.findMany({
      where: {
        tenant_id: tenantId,
        estado: 'ACTIVO',
        id: { not: turno.vigilador_id },
      },
      select: { id: true, nombre: true, apellido: true, legajo_nro: true },
    });
    if (vigiladores.length === 0) return [];

    const ventanaIni = new Date(turno.inicio_plan.getTime() - 8 * 86_400_000);
    const ventanaFin = new Date(turno.fin_plan.getTime() + 8 * 86_400_000);
    const turnosExistentes = await this.prisma.turnoPlanificado.findMany({
      where: {
        tenant_id: tenantId,
        vigilador_id: { in: vigiladores.map((v) => v.id) },
        inicio_plan: { gte: ventanaIni, lte: ventanaFin },
        id: { not: turno.id },
      },
      select: { vigilador_id: true, inicio_plan: true, fin_plan: true },
    });
    const existentesPorVigilador = new Map<string, TurnoRef[]>();
    for (const t of turnosExistentes) {
      const arr = existentesPorVigilador.get(t.vigilador_id) ?? [];
      arr.push({ inicio_plan: t.inicio_plan, fin_plan: t.fin_plan });
      existentesPorVigilador.set(t.vigilador_id, arr);
    }

    const candidato: TurnoRef = {
      inicio_plan: turno.inicio_plan,
      fin_plan: turno.fin_plan,
    };

    return vigiladores
      .map((v) => {
        const existentes = existentesPorVigilador.get(v.id) ?? [];
        const { errores } = validarTurno(candidato, existentes, reglas);
        return { vigilador: v, disponible: errores.length === 0, errores };
      })
      .filter((c) => c.disponible);
  }

  async aprobar(
    tenantId: string,
    actorId: string,
    turnoOriginalId: string,
    dto: AprobarRelevoDto,
  ) {
    const turno = await this.prisma.turnoPlanificado.findFirst({
      where: { id: turnoOriginalId, tenant_id: tenantId },
    });
    if (!turno) throw new NotFoundException('Turno no encontrado');
    if (turno.estado !== 'AUSENTE') {
      throw new BadRequestException(
        'El turno no tiene una solicitud de relevo pendiente',
      );
    }

    const relevista = await this.prisma.vigilador.findFirst({
      where: { id: dto.vigilador_relevista_id, tenant_id: tenantId },
    });
    if (!relevista)
      throw new NotFoundException('Vigilador relevista no encontrado');

    return this.prisma.$transaction(async (tx) => {
      const turnoRelevo = await tx.turnoPlanificado.create({
        data: {
          tenant_id: tenantId,
          puesto_id: turno.puesto_id,
          vigilador_id: dto.vigilador_relevista_id,
          asignacion_esquema_id: null,
          inicio_plan: turno.inicio_plan,
          fin_plan: turno.fin_plan,
          tipo_bloque: turno.tipo_bloque,
          estado: 'CONFIRMADA',
        },
      });

      const relevo = await tx.relevo.create({
        data: {
          tenant_id: tenantId,
          turno_original_id: turno.id,
          turno_relevo_id: turnoRelevo.id,
          motivo: turno.motivo,
        },
      });

      await tx.turnoPlanificado.update({
        where: { id: turno.id },
        data: { estado: 'RELEVADA' },
      });

      this.coGateway.emitToTenant(tenantId, 'relevo.aprobado', {
        turnoOriginalId: turno.id,
        turnoRelevoId: turnoRelevo.id,
        actorId,
        ts: new Date(),
      });

      return { relevo, turnoRelevo };
    });
  }

  async rechazar(tenantId: string, turnoOriginalId: string) {
    const turno = await this.prisma.turnoPlanificado.findFirst({
      where: { id: turnoOriginalId, tenant_id: tenantId },
    });
    if (!turno) throw new NotFoundException('Turno no encontrado');
    if (turno.estado !== 'AUSENTE') {
      throw new BadRequestException(
        'El turno no tiene una solicitud de relevo pendiente',
      );
    }

    return this.prisma.turnoPlanificado.update({
      where: { id: turno.id },
      data: { estado: 'PLANIFICADA', motivo: null },
    });
  }
}
