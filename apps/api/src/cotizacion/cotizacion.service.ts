import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CostosService } from '../costos/costos.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class CotizacionService {
  constructor(
    private prisma: PrismaService,
    private costosService: CostosService,
  ) {}

  async create(tenantId: string, data: any) {
    const config = await this.costosService.findOne(tenantId);

    // Simple calculation logic for the items
    const items = data.items.map((item: any) => {
      const horasMensuales = item.horas_mensuales || 720; // Default 24/7 if not specified
      const costoHora = item.costo_hora || config.costo_hora_base;
      const margen = item.margen || new Prisma.Decimal(0.25); // Target 25% if not specified

      const subtotal = new Prisma.Decimal(horasMensuales)
        .mul(costoHora)
        .mul(new Prisma.Decimal(1).add(config.cargas_sociales))
        .div(new Prisma.Decimal(1).sub(margen));

      return {
        ...item,
        horas_mensuales: horasMensuales,
        costo_hora: costoHora,
        margen: margen,
        subtotal: subtotal,
      };
    });

    const total = items.reduce(
      (acc: Prisma.Decimal, item: any) => acc.add(item.subtotal),
      new Prisma.Decimal(0),
    );

    return this.prisma.cotizacion.create({
      data: {
        tenant_id: tenantId,
        cliente_nombre: data.cliente_nombre,
        vencimiento: new Date(data.vencimiento),
        estado: 'BORRADOR',
        total_mensual: total,
        items: {
          create: items,
        },
      },
      include: {
        items: true,
      },
    });
  }

  async findAll(tenantId: string, role: string) {
    const cotizaciones = await this.prisma.cotizacion.findMany({
      where: { tenant_id: tenantId },
      include: { items: true },
      orderBy: { created_at: 'desc' },
    });

    if (role === 'OPERADOR') {
      return cotizaciones.map((c) => {
        const { total_mensual, ...rest } = c;
        return {
          ...rest,
          items: c.items.map((i) => {
            const { costo_hora, subtotal, ...itemRest } = i;
            return itemRest;
          }),
        };
      });
    }

    return cotizaciones;
  }

  async findOne(id: string, tenantId: string, role: string) {
    const cotizacion = await this.prisma.cotizacion.findFirst({
      where: { id, tenant_id: tenantId },
      include: { items: true },
    });

    if (cotizacion && role === 'OPERADOR') {
      const { total_mensual, ...rest } = cotizacion;
      return {
        ...rest,
        items: cotizacion.items.map((i) => {
          const { costo_hora, subtotal, ...itemRest } = i;
          return itemRest;
        }),
      };
    }

    return cotizacion;
  }
}
