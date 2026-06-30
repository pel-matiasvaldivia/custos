import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { PaginationDto } from '../common/dto/pagination.dto';

// Sólo para convertir horas semanales de cobertura a una estimación mensual
// de costo de vehículo (asignarVehiculo) — no interviene en el cálculo de dotación.
const SEMANAS_POR_MES = 4.345;

interface VentanaCoberturaPuesto {
  horas_dia: number;
  dias: number[];
}

@Injectable()
export class ObjetivoService {
  constructor(private prisma: PrismaService) {}

  /**
   * Dotación requerida por puesto a partir de la cobertura configurada
   * (puesto_cobertura): dotacion = ceil(horas_dia * dias.length / jornada_max_semanal_h).
   * Un puesto sin cobertura configurada aporta 0 (no se puede estimar todavía).
   */
  private async dotacionRequeridaPuestos(
    tenantId: string,
    puestoIds: string[],
  ) {
    if (puestoIds.length === 0) {
      return {
        total: 0,
        horasSemanales: 0,
        detalle: [] as {
          puestoId: string;
          horasSemana: number;
          dotacion: number;
        }[],
      };
    }

    const [regla, coberturas] = await Promise.all([
      this.prisma.reglaLaboral.findUnique({ where: { tenant_id: tenantId } }),
      this.prisma.puestoCobertura.findMany({
        where: { tenant_id: tenantId, puesto_id: { in: puestoIds } },
      }),
    ]);
    const jornadaMaxSemanalH = regla?.jornada_max_semanal_h ?? 48;

    const detalle = coberturas.map((c) => {
      const ventana = c.ventana as unknown as VentanaCoberturaPuesto;
      const horasSemana =
        (ventana.horas_dia ?? 0) * (ventana.dias?.length ?? 0);
      return {
        puestoId: c.puesto_id,
        horasSemana,
        dotacion:
          horasSemana > 0 ? Math.ceil(horasSemana / jornadaMaxSemanalH) : 0,
      };
    });

    return {
      total: detalle.reduce((acc, d) => acc + d.dotacion, 0),
      horasSemanales: detalle.reduce((acc, d) => acc + d.horasSemana, 0),
      detalle,
    };
  }

  async findAll(
    tenantId: string,
    pagination?: PaginationDto,
    clienteId?: string,
  ) {
    const skip = pagination?.skip ?? 0;
    const take = pagination?.limit ?? 50;
    const where = {
      tenant_id: tenantId,
      ...(clienteId ? { cliente_id: clienteId } : {}),
    };

    const [data, total] = await Promise.all([
      this.prisma.objetivo.findMany({
        where,
        include: { _count: { select: { puestos: true } } },
        skip,
        take,
        orderBy: { created_at: 'desc' },
      }),
      this.prisma.objetivo.count({ where }),
    ]);

    return { data, total, page: pagination?.page ?? 1, limit: take };
  }

  async findOne(id: string, tenantId: string) {
    const objetivo = await this.prisma.objetivo.findFirst({
      where: { id, tenant_id: tenantId },
    });
    if (!objetivo) throw new NotFoundException('Objetivo no encontrado');
    return objetivo;
  }

  async findDetalle(id: string, tenantId: string) {
    const objetivo = await this.findOne(id, tenantId);

    const puestos = await this.prisma.puesto.findMany({
      where: { objetivo_id: id, tenant_id: tenantId, deleted_at: null },
      orderBy: { nombre: 'asc' },
    });
    const puestoIds = puestos.map((p: { id: string }) => p.id);

    const haceTreintaDias = new Date();
    haceTreintaDias.setDate(haceTreintaDias.getDate() - 30);

    const [contrato, vehiculosAsignados, asignacionesRecientes] =
      await Promise.all([
        this.prisma.contrato.findFirst({
          where: { objetivo_id: id, tenant_id: tenantId },
          include: { facturacion: true },
          orderBy: { created_at: 'desc' },
        }),
        this.prisma.asignacionMovil.findMany({
          where: { objetivo_id: id, tenant_id: tenantId, hasta: null },
          include: { vehiculo: true },
          orderBy: { desde: 'desc' },
        }),
        puestoIds.length === 0
          ? Promise.resolve([])
          : this.prisma.asignacion.findMany({
              where: {
                tenant_id: tenantId,
                puesto_id: { in: puestoIds },
                fecha: { gte: haceTreintaDias },
                vigilador_id: { not: null },
              },
              include: {
                vigilador: {
                  select: {
                    id: true,
                    nombre: true,
                    apellido: true,
                    estado: true,
                  },
                },
              },
              orderBy: { fecha: 'desc' },
            }),
      ]);

    const personalMap = new Map<
      string,
      { id: string; nombre: string; apellido: string; estado: string }
    >();
    for (const a of asignacionesRecientes) {
      if (a.vigilador) personalMap.set(a.vigilador.id, a.vigilador);
    }
    const personal = Array.from(personalMap.values());
    const vigiladorIds = personal.map((p) => p.id);

    const herramientas =
      vigiladorIds.length === 0
        ? []
        : await this.prisma.herramientaAsignacion.findMany({
            where: {
              tenant_id: tenantId,
              vigilador_id: { in: vigiladorIds },
              devuelta_el: null,
            },
            include: {
              herramienta: true,
              vigilador: { select: { id: true, nombre: true, apellido: true } },
            },
          });

    const { total: vigiladoresRequeridos, horasSemanales } =
      await this.dotacionRequeridaPuestos(tenantId, puestoIds);
    const vigiladoresActivosTotal = await this.prisma.vigilador.count({
      where: { tenant_id: tenantId, estado: 'ACTIVO', deleted_at: null },
    });

    const dotacion = {
      horasSemanales: parseFloat(horasSemanales.toFixed(1)),
      vigiladoresRequeridos,
      vigiladoresActivosTotal,
      suficiente: vigiladoresActivosTotal >= vigiladoresRequeridos,
    };

    return {
      objetivo,
      puestos,
      contrato,
      vehiculosAsignados,
      personal,
      herramientas,
      dotacion,
    };
  }

  /** Si viene cliente_id, completa cliente_nombre como snapshot de Cliente.razon_social. */
  private async resolverClienteNombre(
    tenantId: string,
    clienteId: string | null | undefined,
    clienteNombre: string | null | undefined,
  ): Promise<string | undefined> {
    if (!clienteId) return clienteNombre ?? undefined;
    const cliente = await this.prisma.cliente.findFirst({
      where: { id: clienteId, tenant_id: tenantId, deleted_at: null },
    });
    if (!cliente) throw new NotFoundException('Cliente no encontrado.');
    return cliente.razon_social;
  }

  private async generarCodigoObjetivo(tenantId: string): Promise<string> {
    const year = new Date().getFullYear();
    const prefix = `OBJ-${year}-`;
    const ultimo = await this.prisma.objetivo.findFirst({
      where: { tenant_id: tenantId, codigo: { startsWith: prefix } },
      orderBy: { codigo: 'desc' },
      select: { codigo: true },
    });
    const siguiente = ultimo
      ? parseInt(ultimo.codigo.slice(prefix.length), 10) + 1
      : 1;
    return `${prefix}${String(siguiente).padStart(4, '0')}`;
  }

  async create(
    data: Omit<Prisma.ObjetivoUncheckedCreateInput, 'cliente_nombre' | 'codigo'> & {
      cliente_nombre?: string;
    },
  ) {
    const clienteNombre = await this.resolverClienteNombre(
      data.tenant_id,
      data.cliente_id as string | null | undefined,
      data.cliente_nombre as string | null | undefined,
    );
    if (!clienteNombre) {
      throw new BadRequestException(
        'Debe indicar cliente_id o cliente_nombre.',
      );
    }
    const codigo = await this.generarCodigoObjetivo(data.tenant_id);
    return this.prisma.objetivo.create({
      data: { ...data, cliente_nombre: clienteNombre, codigo },
    });
  }

  async update(
    id: string,
    tenantId: string,
    data: Prisma.ObjetivoUncheckedUpdateInput,
  ) {
    await this.findOne(id, tenantId);

    if (data.estado === 'ACTIVO') {
      const contratoActivo = await this.prisma.contrato.findFirst({
        where: { objetivo_id: id, tenant_id: tenantId, estado: 'ACTIVO', deleted_at: null },
        select: { id: true },
      });
      if (!contratoActivo) {
        throw new BadRequestException(
          'No se puede activar el objetivo sin un contrato activo vinculado.',
        );
      }
    }

    if (data.cliente_id) {
      const clienteNombre = await this.resolverClienteNombre(
        tenantId,
        data.cliente_id as string,
        data.cliente_nombre as string | null | undefined,
      );
      data = { ...data, cliente_nombre: clienteNombre };
    }
    return this.prisma.objetivo.update({ where: { id }, data });
  }

  async asignarVehiculo(
    objetivoId: string,
    tenantId: string,
    vehiculoId: string,
  ) {
    await this.findOne(objetivoId, tenantId);
    const vehiculo = await this.prisma.vehiculo.findFirst({
      where: { id: vehiculoId, tenant_id: tenantId },
    });
    if (!vehiculo) throw new NotFoundException('Vehículo no encontrado');

    const yaAsignado = await this.prisma.asignacionMovil.findFirst({
      where: { vehiculo_id: vehiculoId, hasta: null },
    });
    if (yaAsignado) {
      throw new ConflictException(
        'El vehículo ya está asignado a otro objetivo.',
      );
    }

    const puestos = await this.prisma.puesto.findMany({
      where: { objetivo_id: objetivoId, tenant_id: tenantId, deleted_at: null },
      select: { id: true },
    });
    const { horasSemanales } = await this.dotacionRequeridaPuestos(
      tenantId,
      puestos.map((p) => p.id),
    );
    const horasMensuales = horasSemanales * SEMANAS_POR_MES;
    const costoEstimadoMensual = vehiculo.costo_hora
      ? horasMensuales * Number(vehiculo.costo_hora)
      : null;

    return this.prisma.asignacionMovil.create({
      data: {
        tenant_id: tenantId,
        objetivo_id: objetivoId,
        vehiculo_id: vehiculoId,
        desde: new Date(),
        horas_estimadas_mes:
          horasMensuales > 0 ? parseFloat(horasMensuales.toFixed(1)) : null,
        costo_estimado_mensual: costoEstimadoMensual,
      },
      include: { vehiculo: true },
    });
  }

  async notificarPersonalInsuficiente(objetivoId: string, tenantId: string) {
    const objetivo = await this.findOne(objetivoId, tenantId);
    const puestos = await this.prisma.puesto.findMany({
      where: { objetivo_id: objetivoId, tenant_id: tenantId, deleted_at: null },
      select: { id: true },
    });
    const { total: vigiladoresRequeridos } =
      await this.dotacionRequeridaPuestos(
        tenantId,
        puestos.map((p) => p.id),
      );
    const vigiladoresActivosTotal = await this.prisma.vigilador.count({
      where: { tenant_id: tenantId, estado: 'ACTIVO', deleted_at: null },
    });

    if (vigiladoresActivosTotal >= vigiladoresRequeridos) {
      throw new ConflictException(
        'La nómina actual ya cubre la dotación requerida para este objetivo.',
      );
    }

    const destinatarios = await this.prisma.user.findMany({
      where: {
        tenant_id: tenantId,
        role: { in: ['ADMIN', 'RRHH'] },
        deleted_at: null,
      },
      select: { id: true },
    });

    await this.prisma.notificacion.createMany({
      data: destinatarios.map((d: { id: string }) => ({
        tenant_id: tenantId,
        destinatario_id: d.id,
        tipo: 'PERSONAL_INSUFICIENTE',
        canal: 'IN_APP' as const,
        payload: {
          objetivo_id: objetivoId,
          objetivo_nombre: objetivo.nombre,
          vigiladores_requeridos: vigiladoresRequeridos,
          vigiladores_activos_total: vigiladoresActivosTotal,
        },
      })),
    });

    return { notificados: destinatarios.length };
  }

  async liberarVehiculo(
    objetivoId: string,
    tenantId: string,
    asignacionId: string,
  ) {
    const asignacion = await this.prisma.asignacionMovil.findFirst({
      where: { id: asignacionId, objetivo_id: objetivoId, tenant_id: tenantId },
    });
    if (!asignacion)
      throw new NotFoundException('Asignación de vehículo no encontrada');

    return this.prisma.asignacionMovil.update({
      where: { id: asignacionId },
      data: { hasta: new Date() },
    });
  }
}
