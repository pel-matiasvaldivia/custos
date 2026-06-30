import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { Prisma } from '@prisma/client';
import { CreateAsignacionDto } from './dto/create-asignacion.dto';

@Injectable()
export class AsignacionService {
  constructor(private prisma: PrismaService) {}

  async findByObjetivo(
    tenantId: string,
    objetivoId: string,
    desde: Date,
    hasta: Date,
  ) {
    const puestos = await this.prisma.puesto.findMany({
      where: { tenant_id: tenantId, objetivo_id: objetivoId, deleted_at: null },
      select: { id: true },
    });
    const puestoIds = puestos.map((p) => p.id);
    if (puestoIds.length === 0) return [];

    return this.prisma.asignacion.findMany({
      where: {
        tenant_id: tenantId,
        puesto_id: { in: puestoIds },
        fecha: { gte: desde, lte: hasta },
      },
      include: {
        puesto: true,
        vigilador: true,
      },
      orderBy: [{ fecha: 'asc' }, { hora_inicio: 'asc' }],
    });
  }

  async create(tenantId: string, dto: CreateAsignacionDto) {
    const puesto = await this.prisma.puesto.findFirst({
      where: { id: dto.puesto_id, tenant_id: tenantId, deleted_at: null },
    });
    if (!puesto) throw new NotFoundException('Puesto no encontrado.');

    if (dto.hora_fin <= dto.hora_inicio) {
      throw new ConflictException(
        'El horario "Hasta" debe ser posterior al horario "Desde".',
      );
    }

    try {
      return await this.prisma.asignacion.create({
        data: {
          tenant_id: tenantId,
          puesto_id: dto.puesto_id,
          fecha: new Date(dto.fecha),
          hora_inicio: dto.hora_inicio,
          hora_fin: dto.hora_fin,
          estado: 'PENDIENTE',
        },
        include: { puesto: true, vigilador: true },
      });
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2002'
      ) {
        throw new ConflictException(
          'Ya existe un turno cargado para ese puesto en esa fecha y horario.',
        );
      }
      throw e;
    }
  }

  async liberar(id: string, tenantId: string) {
    const asignacion = await this.prisma.asignacion.findFirst({
      where: { id, tenant_id: tenantId },
    });
    if (!asignacion) throw new NotFoundException('Turno no encontrado.');

    return this.prisma.asignacion.update({
      where: { id },
      data: { vigilador_id: null, estado: 'PENDIENTE' },
      include: { puesto: true, vigilador: true },
    });
  }

  async deleteSlot(id: string, tenantId: string) {
    const asignacion = await this.prisma.asignacion.findFirst({
      where: { id, tenant_id: tenantId },
    });
    if (!asignacion) throw new NotFoundException('Turno no encontrado.');
    if (asignacion.vigilador_id) {
      throw new ConflictException(
        'No se puede eliminar un turno con un vigilador asignado. Liberalo primero.',
      );
    }
    await this.prisma.asignacion.delete({ where: { id } });
  }

  async generateForMonth(tenantId: string, month: Date) {
    const start = startOfMonth(month);
    const end = endOfMonth(month);
    const days = eachDayOfInterval({ start, end });

    const puestos = await this.prisma.puesto.findMany({
      where: { tenant_id: tenantId, deleted_at: null },
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
          }),
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
    const asignacion = await this.prisma.asignacion.findFirst({
      where: { id, tenant_id: tenantId },
    });
    if (!asignacion) throw new NotFoundException('Turno no encontrado.');

    const vigilador = await this.prisma.vigilador.findFirst({
      where: { id: vigiladorId, tenant_id: tenantId, deleted_at: null },
    });
    if (!vigilador) throw new NotFoundException('Vigilador no encontrado.');

    // HARD BLOCK: Check for expired credentials
    const now = new Date();
    const expiredCredentials = await this.prisma.credencial.findMany({
      where: {
        vigilador_id: vigiladorId,
        tenant_id: tenantId,
        vence_el: {
          lt: now,
        },
      },
    });

    if (expiredCredentials.length > 0) {
      const types = expiredCredentials.map((c) => c.tipo).join(', ');
      throw new ConflictException(
        `El vigilador tiene credenciales vencidas (${types}) y no puede ser asignado.`,
      );
    }

    return this.prisma.asignacion.update({
      where: { id },
      data: {
        vigilador_id: vigiladorId,
        estado: 'ASIGNADO',
      },
      include: { puesto: true, vigilador: true },
    });
  }
}
