import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  movilDisponibleYVigente,
  calcularRendimiento,
  planMantenimientoDisparo,
  calcularTCO,
  prorratearTCO,
} from './flota.domain';

@Injectable()
export class FlotaService {
  constructor(private prisma: PrismaService) {}

  /**
   * movilDisponibleYVigente() que consume M1 al asignar un puesto con móvil.
   * TODO(M1): hoy no hay vínculo turno→vehículo en el esquema; este método queda
   * disponible para cuando el cuadrante seleccione un móvil concreto.
   */
  async movilApto(tenantId: string, vehiculoId: string): Promise<boolean> {
    const vehiculo = await this.prisma.vehiculo.findFirst({
      where: { id: vehiculoId, tenant_id: tenantId },
      select: { estado: true },
    });
    if (!vehiculo) throw new NotFoundException('Vehículo no encontrado');

    const vencimientos = await this.prisma.vehiculoVencimiento.findMany({
      where: { tenant_id: tenantId, vehiculo_id: vehiculoId },
      select: { tipo: true, vence_el: true },
    });
    return movilDisponibleYVigente(vehiculo.estado, vencimientos);
  }

  /**
   * Registra una carga de combustible, calcula rendimiento contra la carga
   * anterior y actualiza el km del vehículo.
   */
  async registrarCarga(
    tenantId: string,
    vehiculoId: string,
    dto: {
      fecha: string;
      litros: number;
      importe: number;
      km: number;
      contrato_id?: string;
      objetivo_id?: string;
    },
  ) {
    const anterior = await this.prisma.cargaCombustible.findFirst({
      where: { tenant_id: tenantId, vehiculo_id: vehiculoId, km: { lt: dto.km } },
      orderBy: { km: 'desc' },
      select: { km: true },
    });

    const rendimiento = calcularRendimiento(
      dto.km,
      anterior?.km ?? null,
      dto.litros,
    );

    const carga = await this.prisma.cargaCombustible.create({
      data: {
        tenant_id: tenantId,
        vehiculo_id: vehiculoId,
        fecha: new Date(dto.fecha),
        litros: dto.litros,
        importe: dto.importe,
        km: dto.km,
        rendimiento,
        contrato_id: dto.contrato_id,
        objetivo_id: dto.objetivo_id,
      },
    });

    // Mantener km_actual del vehículo al máximo conocido.
    await this.prisma.vehiculo.update({
      where: { id: vehiculoId },
      data: { km_actual: dto.km },
    });

    return carga;
  }

  /**
   * Evalúa los planes de un vehículo y genera OT PREVENTIVA para los que
   * dispararon (criterio de aceptación #1).
   * @returns ids de OT generadas.
   */
  async evaluarPlanesYGenerarOT(
    tenantId: string,
    vehiculoId: string,
  ): Promise<string[]> {
    const vehiculo = await this.prisma.vehiculo.findFirst({
      where: { id: vehiculoId, tenant_id: tenantId },
      select: { km_actual: true },
    });
    if (!vehiculo) throw new NotFoundException('Vehículo no encontrado');

    const planes = await this.prisma.planMantenimiento.findMany({
      where: { tenant_id: tenantId, vehiculo_id: vehiculoId },
    });

    const generadas: string[] = [];
    for (const plan of planes) {
      if (planMantenimientoDisparo(plan, vehiculo.km_actual)) {
        const ot = await this.prisma.ordenTrabajo.create({
          data: {
            tenant_id: tenantId,
            vehiculo_id: vehiculoId,
            codigo: `OT-AUTO-${Date.now()}-${generadas.length}`,
            tipo: 'PREVENTIVA',
            estado: 'ABIERTA',
            km_al_abrir: vehiculo.km_actual,
          },
        });
        generadas.push(ot.id);
      }
    }
    return generadas;
  }

  /**
   * Flota imputada por contrato en un período: TCO por vehículo (Σ OT + Σ
   * combustible) prorrateado por horas de asignaciones_movil que solapan el
   * período. Alimenta el motor de rentabilidad.
   * TODO(spec): la depreciación no tiene campo en el esquema → se omite (0).
   */
  async flotaImputadaPorContrato(
    tenantId: string,
    desde: Date,
    hasta: Date,
  ): Promise<Map<string, number>> {
    const acumulado = new Map<string, number>();

    const vehiculos = await this.prisma.vehiculo.findMany({
      where: { tenant_id: tenantId },
      select: { id: true },
    });

    for (const v of vehiculos) {
      const [ots, cargas, asignaciones] = await Promise.all([
        this.prisma.ordenTrabajo.findMany({
          where: {
            tenant_id: tenantId,
            vehiculo_id: v.id,
            created_at: { gte: desde, lte: hasta },
          },
          select: { costo_total: true },
        }),
        this.prisma.cargaCombustible.findMany({
          where: {
            tenant_id: tenantId,
            vehiculo_id: v.id,
            fecha: { gte: desde, lte: hasta },
          },
          select: { importe: true },
        }),
        this.prisma.asignacionMovil.findMany({
          where: {
            tenant_id: tenantId,
            vehiculo_id: v.id,
            desde: { lte: hasta },
          },
          select: { contrato_id: true, desde: true, hasta: true },
        }),
      ]);

      const totalOT = ots.reduce((a, o) => a + Number(o.costo_total), 0);
      const totalComb = cargas.reduce((a, c) => a + Number(c.importe), 0);
      const tco = calcularTCO(0, totalOT, totalComb);
      if (tco <= 0) continue;

      const horas = asignaciones.map((a) => {
        const ini = a.desde < desde ? desde : a.desde;
        const fin = a.hasta && a.hasta < hasta ? a.hasta : hasta;
        const ms = Math.max(0, fin.getTime() - ini.getTime());
        return { contrato_id: a.contrato_id, horas: ms / 3_600_000 };
      });

      for (const [contratoId, monto] of prorratearTCO(tco, horas)) {
        acumulado.set(contratoId, (acumulado.get(contratoId) ?? 0) + monto);
      }
    }

    return acumulado;
  }
}
