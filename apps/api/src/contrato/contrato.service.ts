import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
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

  async findByCliente(clienteId: string, tenantId: string) {
    return this.prisma.contrato.findMany({
      where: { cliente_id: clienteId, tenant_id: tenantId },
      include: { facturacion: true },
      orderBy: { created_at: 'desc' },
    });
  }

  /** Si viene cliente_id, completa cliente_nombre como snapshot de Cliente.razon_social. */
  private async resolverClienteNombre(
    tenantId: string,
    clienteId: string | undefined,
    clienteNombre: string | undefined,
  ): Promise<string> {
    if (!clienteId) {
      if (!clienteNombre) throw new BadRequestException('Debe indicar cliente_id o cliente_nombre.');
      return clienteNombre;
    }
    const cliente = await this.prisma.cliente.findFirst({
      where: { id: clienteId, tenant_id: tenantId, deleted_at: null },
    });
    if (!cliente) throw new NotFoundException('Cliente no encontrado.');
    return cliente.razon_social;
  }

  async create(tenantId: string, dto: CreateContratoDto) {
    const codigo =
      dto.codigo || `CON-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`;
    const clienteNombre = await this.resolverClienteNombre(tenantId, dto.cliente_id, dto.cliente_nombre);

    return this.prisma.contrato.create({
      data: {
        tenant_id: tenantId,
        codigo,
        cliente_id: dto.cliente_id,
        cliente_nombre: clienteNombre,
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
    if (contratoFields.cliente_id) {
      contratoFields.cliente_nombre = await this.resolverClienteNombre(
        tenantId,
        contratoFields.cliente_id,
        contratoFields.cliente_nombre,
      );
    }
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
