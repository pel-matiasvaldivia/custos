import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateContratoDto } from './dto/create-contrato.dto';
import { UpdateContratoDto } from './dto/update-contrato.dto';

@Injectable()
export class ContratoService {
  constructor(private prisma: PrismaService) {}

  async findOne(id: string, tenantId: string) {
    const contrato = await this.prisma.contrato.findFirst({
      where: { id, tenant_id: tenantId },
      include: { facturacion: true },
    });
    if (!contrato) throw new NotFoundException('Contrato no encontrado');
    return contrato;
  }

  async findByObjetivo(objetivoId: string, tenantId: string) {
    return this.prisma.contrato.findMany({
      where: { objetivo_id: objetivoId, tenant_id: tenantId },
      include: { facturacion: true },
      orderBy: { created_at: 'desc' },
    });
  }

  async create(tenantId: string, dto: CreateContratoDto) {
    const codigo =
      dto.codigo || `CON-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`;

    return this.prisma.contrato.create({
      data: {
        tenant_id: tenantId,
        codigo,
        cliente_nombre: dto.cliente_nombre,
        objetivo_id: dto.objetivo_id,
        inicio: dto.inicio,
        fin: dto.fin,
        facturacion: {
          create: {
            tenant_id: tenantId,
            modo: dto.modo,
            tarifa_hora: dto.tarifa_hora,
            abono_mensual: dto.abono_mensual,
            redondeo_min: dto.redondeo_min ?? 0,
            penaliza_hueco: dto.penaliza_hueco ?? false,
          },
        },
      },
      include: { facturacion: true },
    });
  }

  async update(id: string, tenantId: string, dto: UpdateContratoDto) {
    await this.findOne(id, tenantId);

    const { modo, tarifa_hora, abono_mensual, redondeo_min, penaliza_hueco, ...contratoFields } =
      dto;
    const facturacionFields = { modo, tarifa_hora, abono_mensual, redondeo_min, penaliza_hueco };
    const hayCambiosFacturacion = Object.values(facturacionFields).some((v) => v !== undefined);

    return this.prisma.contrato.update({
      where: { id },
      data: {
        ...contratoFields,
        facturacion: hayCambiosFacturacion
          ? { update: facturacionFields }
          : undefined,
      },
      include: { facturacion: true },
    });
  }
}
