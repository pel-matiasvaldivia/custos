import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { startOfMonth, endOfMonth, eachDayOfInterval, format } from 'date-fns';

@Injectable()
export class AsignacionService {
  constructor(private prisma: PrismaService) {}

  async generateForMonth(tenantId: string, month: Date) {
    const start = startOfMonth(month);
    const end = endOfMonth(month);
    const days = eachDayOfInterval({ start, end });

    const puestos = await this.prisma.puesto.findMany({
      where: { tenant_id: tenantId },
    });

    const creations = [];

    for (const puesto of puestos) {
      for (const day of days) {
        // Simple logic: one 12hs shift as placeholder
        // In real M1, this would check the Puesto.config for specific schedules
        creations.push(
          this.prisma.asignacion.upsert({
            where: {
              puesto_id_fecha_hora_inicio: {
                puesto_id: puesto.id,
                fecha: day,
                hora_inicio: '08:00',
              },
            },
            update: {},
            create: {
              tenant_id: tenantId,
              puesto_id: puesto.id,
              fecha: day,
              hora_inicio: '08:00',
              hora_fin: '20:00',
              estado: 'PENDIENTE',
            },
          })
        );
      }
    }

    return Promise.all(creations);
  }

  async findAll(tenantId: string, from: Date, to: Date) {
    return this.prisma.asignacion.findMany({
      where: {
        tenant_id: tenantId,
        fecha: {
          gte: from,
          lte: to,
        },
      },
      include: {
        puesto: true,
        vigilador: true,
      },
      orderBy: { fecha: 'asc' },
    });
  }
  
  async asignVigilante(id: string, tenantId: string, vigiladorId: string) {
    return this.prisma.asignacion.update({
      where: { id, tenant_id: tenantId },
      data: {
        vigilador_id: vigiladorId,
        estado: 'ASIGNADO',
      },
    });
  }
}
