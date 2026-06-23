import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RondaService {
  constructor(private prisma: PrismaService) {}

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
          include: { punto_control: true }
        }
      },
    });
  }
}
