import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ComprasService {
  constructor(private prisma: PrismaService) {}

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
  async createOrdenCompra(tenantId: string, data: any) {
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

    return this.prisma.ordenCompra.create({
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
  }

  async recibirParcial(
    tenantId: string,
    ocId: string,
    itemsRecibidos: { itemId: string; cantidad: number }[],
  ) {
    // Basic logic to update reception
    for (const item of itemsRecibidos) {
      await this.prisma.ordenCompraItem.update({
        where: { id: item.itemId },
        data: {
          cantidad_recibida: { increment: item.cantidad },
        },
      });
    }

    // Check if fully received
    const oc = await this.prisma.ordenCompra.findUnique({
      where: { id: ocId },
      include: { items: true },
    });

    if (!oc) throw new NotFoundException('Orden de compra no encontrada');

    const fullyReceived = oc.items.every(
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

  async findAllOC(tenantId: string) {
    return this.prisma.ordenCompra.findMany({
      where: { tenant_id: tenantId },
      include: { items: true, solicitud: true },
      orderBy: { created_at: 'desc' },
    });
  }
}
