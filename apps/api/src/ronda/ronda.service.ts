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
      tolerancia_min?: number | null;
      puntos: { punto_control_id: string; orden?: number }[];
    },
  ) {
    if (!dto.nombre?.trim()) {
      throw new BadRequestException('La ronda necesita un nombre.');
    }
    const tolerancia =
      dto.tolerancia_min == null
        ? null
        : Math.floor(Number(dto.tolerancia_min));
    if (
      tolerancia !== null &&
      (!Number.isFinite(tolerancia) || tolerancia < 1)
    ) {
      throw new BadRequestException(
        'La tolerancia debe ser un número de minutos mayor a cero.',
      );
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
        tolerancia_min: tolerancia,
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

  /**
   * Edita una plantilla: nombre, tolerancia y/o puntos (recorrido).
   * Cuando cambia el set de puntos, borra los viejos y crea los nuevos para
   * respetar @@unique([plantilla_id, punto_control_id]) sin conflictos.
   */
  async actualizarPlantilla(
    tenantId: string,
    id: string,
    dto: {
      nombre?: string;
      tolerancia_min?: number | null;
      puntos?: { punto_control_id: string; orden?: number }[];
    },
  ) {
    const existente = await this.prisma.rondaPlantilla.findFirst({
      where: { id, tenant_id: tenantId },
    });
    if (!existente) throw new NotFoundException('Ronda no encontrada');

    const data: Record<string, unknown> = {};
    if (dto.nombre !== undefined) {
      if (!dto.nombre.trim()) {
        throw new BadRequestException('La ronda necesita un nombre.');
      }
      data.nombre = dto.nombre.trim();
    }
    if (dto.tolerancia_min !== undefined) {
      const tol =
        dto.tolerancia_min == null
          ? null
          : Math.floor(Number(dto.tolerancia_min));
      if (tol !== null && (!Number.isFinite(tol) || tol < 1)) {
        throw new BadRequestException(
          'La tolerancia debe ser un número de minutos mayor a cero.',
        );
      }
      data.tolerancia_min = tol;
    }

    if (dto.puntos) {
      if (dto.puntos.length === 0) {
        throw new BadRequestException(
          'La ronda necesita al menos un punto de control.',
        );
      }
      const validos = await this.prisma.puntoControl.count({
        where: {
          tenant_id: tenantId,
          id: { in: dto.puntos.map((p) => p.punto_control_id) },
        },
      });
      if (validos !== dto.puntos.length) {
        throw new BadRequestException('Hay puntos de control no válidos.');
      }
      await this.prisma.rondaPlantillaPunto.deleteMany({
        where: { plantilla_id: id },
      });
      await this.prisma.rondaPlantillaPunto.createMany({
        data: dto.puntos.map((p, i) => ({
          plantilla_id: id,
          punto_control_id: p.punto_control_id,
          orden: p.orden ?? i,
        })),
      });
    }

    return this.prisma.rondaPlantilla.update({
      where: { id },
      data,
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
