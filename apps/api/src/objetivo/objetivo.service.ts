import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { PaginationDto } from '../common/dto/pagination.dto';

@Injectable()
export class ObjetivoService {
  constructor(private prisma: PrismaService) {}

  async findAll(tenantId: string, pagination?: PaginationDto) {
    const skip = pagination?.skip ?? 0;
    const take = pagination?.limit ?? 50;

    const [data, total] = await Promise.all([
      this.prisma.objetivo.findMany({
        where: { tenant_id: tenantId },
        include: { _count: { select: { puestos: true } } },
        skip,
        take,
        orderBy: { created_at: 'desc' },
      }),
      this.prisma.objetivo.count({ where: { tenant_id: tenantId } }),
    ]);

    return { data, total, page: pagination?.page ?? 1, limit: take };
  }

  async findOne(id: string, tenantId: string) {
    const objetivo = await this.prisma.objetivo.findFirst({
      where: { id, tenant_id: tenantId },
    });
    if (!objetivo) throw new NotFoundException('Objetivo no encontrado');
    return objetivo;
  }

  async findDetalle(id: string, tenantId: string) {
    const objetivo = await this.findOne(id, tenantId);

    const puestos = await this.prisma.puesto.findMany({
      where: { objetivo_id: id, tenant_id: tenantId },
      orderBy: { nombre: 'asc' },
    });
    const puestoIds = puestos.map((p: { id: string }) => p.id);

    const haceTreintaDias = new Date();
    haceTreintaDias.setDate(haceTreintaDias.getDate() - 30);

    const [contrato, vehiculosAsignados, asignacionesRecientes] = await Promise.all([
      this.prisma.contrato.findFirst({
        where: { objetivo_id: id, tenant_id: tenantId },
        include: { facturacion: true },
        orderBy: { created_at: 'desc' },
      }),
      this.prisma.asignacionMovil.findMany({
        where: { objetivo_id: id, tenant_id: tenantId, hasta: null },
        include: { vehiculo: true },
        orderBy: { desde: 'desc' },
      }),
      puestoIds.length === 0
        ? Promise.resolve([])
        : this.prisma.asignacion.findMany({
            where: {
              tenant_id: tenantId,
              puesto_id: { in: puestoIds },
              fecha: { gte: haceTreintaDias },
              vigilador_id: { not: null },
            },
            include: {
              vigilador: {
                select: { id: true, nombre: true, apellido: true, estado: true },
              },
            },
            orderBy: { fecha: 'desc' },
          }),
    ]);

    const personalMap = new Map<string, { id: string; nombre: string; apellido: string; estado: string }>();
    for (const a of asignacionesRecientes) {
      if (a.vigilador) personalMap.set(a.vigilador.id, a.vigilador);
    }
    const personal = Array.from(personalMap.values());
    const vigiladorIds = personal.map((p) => p.id);

    const herramientas =
      vigiladorIds.length === 0
        ? []
        : await this.prisma.herramientaAsignacion.findMany({
            where: {
              tenant_id: tenantId,
              vigilador_id: { in: vigiladorIds },
              devuelta_el: null,
            },
            include: {
              herramienta: true,
              vigilador: { select: { id: true, nombre: true, apellido: true } },
            },
          });

    return {
      objetivo,
      puestos,
      contrato,
      vehiculosAsignados,
      personal,
      herramientas,
    };
  }

  async create(data: Prisma.ObjetivoUncheckedCreateInput) {
    return this.prisma.objetivo.create({ data });
  }

  async update(id: string, tenantId: string, data: Prisma.ObjetivoUncheckedUpdateInput) {
    await this.findOne(id, tenantId);
    return this.prisma.objetivo.update({ where: { id }, data });
  }

  async asignarVehiculo(objetivoId: string, tenantId: string, vehiculoId: string) {
    await this.findOne(objetivoId, tenantId);
    const vehiculo = await this.prisma.vehiculo.findFirst({
      where: { id: vehiculoId, tenant_id: tenantId },
    });
    if (!vehiculo) throw new NotFoundException('Vehículo no encontrado');

    return this.prisma.asignacionMovil.create({
      data: {
        tenant_id: tenantId,
        objetivo_id: objetivoId,
        vehiculo_id: vehiculoId,
        desde: new Date(),
      },
      include: { vehiculo: true },
    });
  }

  async liberarVehiculo(objetivoId: string, tenantId: string, asignacionId: string) {
    const asignacion = await this.prisma.asignacionMovil.findFirst({
      where: { id: asignacionId, objetivo_id: objetivoId, tenant_id: tenantId },
    });
    if (!asignacion) throw new NotFoundException('Asignación de vehículo no encontrada');

    return this.prisma.asignacionMovil.update({
      where: { id: asignacionId },
      data: { hasta: new Date() },
    });
  }
}
