import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditoriaService } from '../modules/auditoria/auditoria.service';
import { PaginationDto } from '../common/dto/pagination.dto';

@Injectable()
export class ComprasService {
  constructor(
    private prisma: PrismaService,
    private auditoria: AuditoriaService,
  ) {}

  // Thresholds
  async getThreshold(tenantId: string) {
    return this.prisma.umbralAprobacion.findFirst({
      where: { tenant_id: tenantId },
    });
  }

  // Solicitudes
  async createSolicitud(tenantId: string, userId: string, data: any) {
    return this.prisma.solicitudCompra.create({
      data: {
        tenant_id: tenantId,
        user_id: userId,
        descripcion: data.descripcion,
        monto_estimado: data.monto_estimado,
        contrato_id: data.contrato_id,
        vehiculo_id: data.vehiculo_id,
      },
    });
  }

  // Ordenes de Compra
  async createOrdenCompra(tenantId: string, data: any, actorId?: string) {
    const threshold = await this.getThreshold(tenantId);
    const supervisorLimit = threshold?.monto_max_supervisor || 50000; // Default if not set

    const total = data.items.reduce(
      (acc: number, item: any) => acc + item.cantidad * item.precio_unitario,
      0,
    );

    let estado = 'APROBADA';
    if (total > Number(supervisorLimit)) {
      estado = 'EN_APROBACION';
    }

    const oc = await this.prisma.ordenCompra.create({
      data: {
        tenant_id: tenantId,
        solicitud_id: data.solicitud_id,
        proveedor_nombre: data.proveedor_nombre,
        total: total,
        estado: estado,
        items: {
          create: data.items.map((i: any) => ({
            descripcion: i.descripcion,
            cantidad: i.cantidad,
            precio_unitario: i.precio_unitario,
            subtotal: i.cantidad * i.precio_unitario,
            contrato_id: i.contrato_id,
            vehiculo_id: i.vehiculo_id,
          })),
        },
      },
      include: { items: true },
    });

    // Acción sensible: alta de OC (queda APROBADA o EN_APROBACION).
    if (actorId) {
      await this.auditoria.registrar({
        tenantId,
        actorId,
        entidad: 'ordenes_compra',
        entidadId: oc.id,
        accion: 'CREAR',
        despues: { total: oc.total, estado: oc.estado },
      });
    }

    return oc;
  }

  async recibirParcial(
    tenantId: string,
    ocId: string,
    itemsRecibidos: { itemId: string; cantidad: number }[],
  ) {
    const oc = await this.prisma.ordenCompra.findFirst({
      where: { id: ocId, tenant_id: tenantId },
      include: { items: true },
    });

    if (!oc) throw new NotFoundException('Orden de compra no encontrada');

    const itemIds = new Set(oc.items.map((i) => i.id));
    for (const item of itemsRecibidos) {
      if (!itemIds.has(item.itemId)) {
        throw new NotFoundException(
          `Item ${item.itemId} no pertenece a esta orden`,
        );
      }
      await this.prisma.ordenCompraItem.update({
        where: { id: item.itemId },
        data: {
          cantidad_recibida: { increment: item.cantidad },
        },
      });
    }

    const updatedOc = await this.prisma.ordenCompra.findUnique({
      where: { id: ocId },
      include: { items: true },
    });

    const fullyReceived = updatedOc!.items.every(
      (i) => Number(i.cantidad_recibida) >= Number(i.cantidad),
    );

    return this.prisma.ordenCompra.update({
      where: { id: ocId },
      data: {
        estado: fullyReceived ? 'RECIBIDA' : 'RECIBIDA_PARCIAL',
      },
    });
  }

  async registrarPago(tenantId: string, ocId: string, monto: number) {
    const oc = await this.prisma.ordenCompra.update({
      where: { id: ocId },
      data: {
        total_pagado: { increment: monto },
      },
    });

    if (Number(oc.total_pagado) >= Number(oc.total)) {
      return this.prisma.ordenCompra.update({
        where: { id: ocId },
        data: { estado: 'PAGADA' },
      });
    }

    return oc;
  }

  async findAllOC(tenantId: string, pagination?: PaginationDto) {
    const skip = pagination?.skip ?? 0;
    const take = pagination?.limit ?? 50;

    const [data, total] = await Promise.all([
      this.prisma.ordenCompra.findMany({
        where: { tenant_id: tenantId },
        include: { items: true, solicitud: true },
        orderBy: { created_at: 'desc' },
        skip,
        take,
      }),
      this.prisma.ordenCompra.count({ where: { tenant_id: tenantId } }),
    ]);

    return { data, total, page: pagination?.page ?? 1, limit: take };
  }
}
