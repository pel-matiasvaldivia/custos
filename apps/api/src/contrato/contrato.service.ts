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

  /**
   * Disparado al aceptar una Cotización (Etapa 2→3 del camino crítico): crea
   * un Contrato en BORRADOR pre-cargado con el cliente de la cotización, sin
   * ContratoFacturacion todavía — eso se completa a mano antes de activarlo
   * (ver guarda en `update`). Idempotente: si la cotización ya tiene contrato
   * asociado, lo devuelve en vez de duplicar.
   */
  async crearDesdeCotizacion(
    tenantId: string,
    cotizacion: { id: string; cliente_id: string | null; cliente_nombre: string },
  ) {
    const existente = await this.prisma.contrato.findFirst({
      where: { tenant_id: tenantId, cotizacion_id: cotizacion.id },
      include: { facturacion: true },
    });
    if (existente) return existente;

    const codigo = `CON-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`;
    return this.prisma.contrato.create({
      data: {
        tenant_id: tenantId,
        codigo,
        cliente_id: cotizacion.cliente_id,
        cliente_nombre: cotizacion.cliente_nombre,
        cotizacion_id: cotizacion.id,
        estado: 'BORRADOR',
      },
      include: { facturacion: true },
    });
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
        inicio: dto.inicio ? new Date(dto.inicio) : undefined,
        fin: dto.fin ? new Date(dto.fin) : undefined,
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
    const contrato = await this.findOne(id, tenantId);

    const { modo, tarifa_hora, abono_mensual, redondeo_min, penaliza_hueco, ...contratoFields } =
      dto;
    const datosContrato: Omit<typeof contratoFields, 'inicio' | 'fin'> & { inicio?: Date; fin?: Date } = {
      ...contratoFields,
      inicio: contratoFields.inicio ? new Date(contratoFields.inicio) : undefined,
      fin: contratoFields.fin ? new Date(contratoFields.fin) : undefined,
    };
    if (datosContrato.cliente_id) {
      datosContrato.cliente_nombre = await this.resolverClienteNombre(
        tenantId,
        datosContrato.cliente_id,
        datosContrato.cliente_nombre,
      );
    }
    const facturacionFields = { modo, tarifa_hora, abono_mensual, redondeo_min, penaliza_hueco };
    const hayCambiosFacturacion = Object.values(facturacionFields).some((v) => v !== undefined);

    // Regla crítica: un Contrato sin ContratoFacturacion no puede pasar a ACTIVO,
    // o la etapa de facturación más adelante no tiene cómo calcular nada.
    if (datosContrato.estado === 'ACTIVO' && !contrato.facturacion && !modo) {
      throw new BadRequestException(
        'No se puede activar el contrato sin configurar la facturación (modo, tarifa/abono).',
      );
    }

    return this.prisma.contrato.update({
      where: { id },
      data: {
        ...datosContrato,
        facturacion: hayCambiosFacturacion
          ? contrato.facturacion
            ? { update: facturacionFields }
            : {
                create: {
                  tenant_id: tenantId,
                  modo: modo!,
                  tarifa_hora,
                  abono_mensual,
                  redondeo_min: redondeo_min ?? 0,
                  penaliza_hueco: penaliza_hueco ?? false,
                },
              }
          : undefined,
      },
      include: { facturacion: true },
    });
  }
}
