import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RondaService {
  constructor(private prisma: PrismaService) {}

  // ─── Plantillas de ronda (rondas programadas por objetivo) ───

  async crearPlantilla(
    tenantId: string,
    dto: {
      objetivo_id: string;
      nombre: string;
      puntos: { punto_control_id: string; orden?: number }[];
    },
  ) {
    if (!dto.nombre?.trim()) {
      throw new BadRequestException('La ronda necesita un nombre.');
    }
    if (!dto.puntos?.length) {
      throw new BadRequestException(
        'La ronda necesita al menos un punto de control.',
      );
    }
    const objetivo = await this.prisma.objetivo.findFirst({
      where: { id: dto.objetivo_id, tenant_id: tenantId },
    });
    if (!objetivo) throw new NotFoundException('Objetivo no encontrado');

    const puntosValidos = await this.prisma.puntoControl.count({
      where: {
        tenant_id: tenantId,
        id: { in: dto.puntos.map((p) => p.punto_control_id) },
      },
    });
    if (puntosValidos !== dto.puntos.length) {
      throw new BadRequestException('Hay puntos de control no válidos.');
    }

    return this.prisma.rondaPlantilla.create({
      data: {
        tenant_id: tenantId,
        objetivo_id: dto.objetivo_id,
        nombre: dto.nombre.trim(),
        puntos: {
          create: dto.puntos.map((p, i) => ({
            punto_control_id: p.punto_control_id,
            orden: p.orden ?? i,
          })),
        },
      },
      include: {
        puntos: {
          orderBy: { orden: 'asc' },
          include: { punto_control: true },
        },
      },
    });
  }

  async listarPlantillas(tenantId: string, objetivoId: string) {
    return this.prisma.rondaPlantilla.findMany({
      where: { tenant_id: tenantId, objetivo_id: objetivoId, activa: true },
      orderBy: { created_at: 'asc' },
      include: {
        puntos: {
          orderBy: { orden: 'asc' },
          include: { punto_control: { include: { puesto: true } } },
        },
      },
    });
  }

  async desactivarPlantilla(tenantId: string, id: string) {
    const plantilla = await this.prisma.rondaPlantilla.findFirst({
      where: { id, tenant_id: tenantId },
    });
    if (!plantilla) throw new NotFoundException('Ronda no encontrada');
    return this.prisma.rondaPlantilla.update({
      where: { id },
      data: { activa: false },
    });
  }

  /** Evidencia: ejecuciones de ronda del objetivo con sus marcas (quién, cuándo, dónde). */
  async ejecucionesPorObjetivo(tenantId: string, objetivoId: string) {
    return this.prisma.ronda.findMany({
      where: {
        tenant_id: tenantId,
        OR: [
          { plantilla: { objetivo_id: objetivoId } },
          { puesto: { objetivo_id: objetivoId } },
        ],
      },
      orderBy: { hora_inicio: 'desc' },
      take: 30,
      include: {
        vigilador: { select: { id: true, nombre: true, apellido: true } },
        plantilla: {
          include: { puntos: { include: { punto_control: true } } },
        },
        marcas: {
          orderBy: { timestamp: 'asc' },
          include: { punto_control: true },
        },
      },
    });
  }

  // Checkpoints
  async createCheckpoint(tenantId: string, data: any) {
    return this.prisma.puntoControl.create({
      data: {
        tenant_id: tenantId,
        puesto_id: data.puesto_id,
        nombre: data.nombre,
        codigo_qr: data.codigo_qr,
        nfc_id: data.nfc_id,
        lat: data.lat,
        lng: data.lng,
      },
    });
  }

  async getCheckpointsByPuesto(tenantId: string, puestoId: string) {
    return this.prisma.puntoControl.findMany({
      where: { tenant_id: tenantId, puesto_id: puestoId },
    });
  }

  // Rounds
  async startRonda(tenantId: string, data: any) {
    return this.prisma.ronda.create({
      data: {
        tenant_id: tenantId,
        puesto_id: data.puesto_id,
        vigilador_id: data.vigilador_id,
        nombre: data.nombre || 'Ronda de Rutina',
        estado: 'EN_PROGRESO',
      },
    });
  }

  async markCheckpoint(tenantId: string, rondaId: string, data: any) {
    return this.prisma.marcaRonda.create({
      data: {
        ronda_id: rondaId,
        punto_control_id: data.punto_control_id,
        lat: data.lat,
        lng: data.lng,
      },
    });
  }

  async finishRonda(tenantId: string, rondaId: string) {
    return this.prisma.ronda.update({
      where: { id: rondaId, tenant_id: tenantId },
      data: {
        hora_fin: new Date(),
        estado: 'COMPLETADA',
      },
    });
  }

  async getActiveRondas(tenantId: string) {
    return this.prisma.ronda.findMany({
      where: { tenant_id: tenantId, estado: 'EN_PROGRESO' },
      include: {
        puesto: true,
        vigilador: true,
        marcas: {
          include: { punto_control: true },
        },
      },
    });
  }
}
