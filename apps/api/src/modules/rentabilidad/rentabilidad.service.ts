import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  calcularRentabilidad,
  ResultadoRentabilidad,
} from './rentabilidad.domain';
import { FlotaService } from '../flota/flota.service';

export interface RentabilidadContrato extends ResultadoRentabilidad {
  contratoId: string;
  codigo: string;
  clienteNombre: string;
  /**
   * true mientras falten insumos en el esquema actual para que el margen sea
   * definitivo (multiplicadores de costo por concepto, TCO de flota).
   */
  incompleto: boolean;
  insumosFaltantes: string[];
}

@Injectable()
export class RentabilidadService {
  constructor(
    private prisma: PrismaService,
    private flota: FlotaService,
  ) {}

  /**
   * Rentabilidad por contrato del tenant para un período.
   *
   * Implementa la fórmula del spec (MODELO_MOTOR L347):
   *   facturacion   = hh_facturables × tarifa_hora  (o abono_mensual)
   *   costo_laboral = Σ(hh × costo_hora)            (aprox: costo_hora_base)
   *   margen        = facturacion − costo_laboral − compras − flota
   *
   * Insumos REALES usados: ConciliacionHH, ContratoFacturacion, OrdenCompraItem,
   * ConfiguracionCostos.
   * TODO(spec): el costo laboral debería usar precio por concepto
   *   (normal/nocturno/extra/feriado); el esquema no tiene esa tabla de tarifas,
   *   se usa costo_hora_base sobre hh_reales como aproximación.
   * TODO(spec M6): flota_imputada (TCO prorrateado por asignaciones_movil) aún
   *   no tiene soporte en el esquema → 0.
   */
  async rentabilidadPorContrato(
    tenantId: string,
    periodoId: string,
  ): Promise<RentabilidadContrato[]> {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
      select: { margen_objetivo: true },
    });
    if (!tenant) throw new NotFoundException('Tenant no encontrado');
    const umbralErosion = Number(tenant.margen_objetivo);

    const periodo = await this.prisma.periodo.findFirst({
      where: { id: periodoId, tenant_id: tenantId },
      select: { id: true, desde: true, hasta: true },
    });
    if (!periodo) throw new NotFoundException('Período no encontrado');

    // Flota imputada por contrato (TCO prorrateado) en el rango del período.
    const flotaPorContrato = await this.flota.flotaImputadaPorContrato(
      tenantId,
      periodo.desde,
      periodo.hasta,
    );

    const config = await this.prisma.configuracionCostos.findUnique({
      where: { tenant_id: tenantId },
      select: { costo_hora_base: true },
    });
    const costoHoraBase = config ? Number(config.costo_hora_base) : 0;

    // Conciliaciones del período, agrupadas por contrato.
    const conciliaciones = await this.prisma.conciliacionHH.findMany({
      where: { tenant_id: tenantId, periodo_id: periodoId },
      select: {
        contrato_id: true,
        hh_facturables: true,
        hh_reales: true,
      },
    });

    const contratoIds = Array.from(
      new Set(conciliaciones.map((c) => c.contrato_id)),
    );
    if (contratoIds.length === 0) return [];

    const [contratos, facturaciones, lineasCompra] = await Promise.all([
      this.prisma.contrato.findMany({
        where: { id: { in: contratoIds }, tenant_id: tenantId },
        select: { id: true, codigo: true, cliente_nombre: true },
      }),
      this.prisma.contratoFacturacion.findMany({
        where: { tenant_id: tenantId, contrato_id: { in: contratoIds } },
        select: {
          contrato_id: true,
          modo: true,
          tarifa_hora: true,
          abono_mensual: true,
        },
      }),
      this.prisma.ordenCompraItem.findMany({
        where: {
          contrato_id: { in: contratoIds },
          orden: { tenant_id: tenantId },
        },
        select: { contrato_id: true, subtotal: true },
      }),
    ]);

    const contratoById = new Map(contratos.map((c) => [c.id, c]));
    const factById = new Map(facturaciones.map((f) => [f.contrato_id, f]));

    const hhByContrato = new Map<
      string,
      { facturables: number; reales: number }
    >();
    for (const c of conciliaciones) {
      const acc = hhByContrato.get(c.contrato_id) ?? {
        facturables: 0,
        reales: 0,
      };
      acc.facturables += Number(c.hh_facturables);
      acc.reales += Number(c.hh_reales);
      hhByContrato.set(c.contrato_id, acc);
    }

    const comprasByContrato = new Map<string, number>();
    for (const l of lineasCompra) {
      if (!l.contrato_id) continue;
      comprasByContrato.set(
        l.contrato_id,
        (comprasByContrato.get(l.contrato_id) ?? 0) + Number(l.subtotal),
      );
    }

    return contratoIds.map((contratoId) => {
      const contrato = contratoById.get(contratoId);
      const hh = hhByContrato.get(contratoId) ?? { facturables: 0, reales: 0 };
      const fact = factById.get(contratoId);

      // Facturación según modo de contrato (spec M1).
      let facturacion = 0;
      const insumosFaltantes: string[] = [
        'costo_laboral por concepto (tarifas nocturno/extra/feriado)',
      ];
      if (fact) {
        if (fact.modo === 'ABONO_FIJO') {
          facturacion = Number(fact.abono_mensual ?? 0);
        } else {
          facturacion = hh.facturables * Number(fact.tarifa_hora ?? 0);
        }
      } else {
        insumosFaltantes.push('contrato_facturacion (sin configurar)');
      }

      // Costo laboral aproximado: hh_reales × costo_hora_base.
      const costoLaboral = hh.reales * costoHoraBase;
      const comprasImputadas = comprasByContrato.get(contratoId) ?? 0;
      const flotaImputada = flotaPorContrato.get(contratoId) ?? 0;

      const base = calcularRentabilidad({
        facturacion,
        costoLaboral,
        comprasImputadas,
        flotaImputada,
        umbralErosion,
      });

      return {
        contratoId,
        codigo: contrato?.codigo ?? '',
        clienteNombre: contrato?.cliente_nombre ?? '',
        ...base,
        incompleto: true,
        insumosFaltantes,
      };
    });
  }
}
