import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { ArcaConfigService } from './arca-config.service';
import { WsaaService } from './wsaa.service';
import { WsfeService } from './wsfe.service';
import { FacturarDto } from '../dto/facturar.dto';
import { IVA_21, CONCEPTO, COMPROBANTE_LABEL } from '../arca.constants';
import { SolicitudCae } from '../arca.types';

// Los comprobantes clase C (monotributo) no discriminan IVA; A y B sí.
const SIN_IVA_DISCRIMINADO = new Set([11, 13]);

export interface ItemCalculado {
  descripcion: string;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
}

@Injectable()
export class FacturacionService {
  private readonly logger = new Logger(FacturacionService.name);

  constructor(
    private prisma: PrismaService,
    private config: ArcaConfigService,
    private wsaa: WsaaService,
    private wsfe: WsfeService,
  ) {}

  /** Verifica cert/clave/conectividad pidiendo un Ticket de Acceso a ARCA. */
  async probarConexion(tenantId: string) {
    const ta = await this.wsaa.obtenerTicket(tenantId);
    return { ok: true, ta_expira: new Date(ta.expira).toISOString() };
  }

  async facturar(tenantId: string, dto: FacturarDto) {
    const cred = await this.config.obtenerCredenciales(tenantId);
    const concepto = dto.concepto ?? CONCEPTO.SERVICIOS;
    const discriminaIva = !SIN_IVA_DISCRIMINADO.has(dto.tipo_comprobante);

    const items: ItemCalculado[] = dto.items.map((i) => ({
      descripcion: i.descripcion,
      cantidad: i.cantidad,
      precio_unitario: i.precio_unitario,
      subtotal: redondear(i.cantidad * i.precio_unitario),
    }));
    const base = redondear(items.reduce((acc, i) => acc + i.subtotal, 0));

    // Para A/B el precio cargado es neto y el IVA se suma; para C no hay IVA.
    const importeNeto = base;
    const importeIva = discriminaIva ? redondear(base * IVA_21.porcentaje) : 0;
    const importeTotal = redondear(importeNeto + importeIva);

    if (importeTotal <= 0) {
      throw new BadRequestException(
        'El importe total del comprobante debe ser mayor a cero.',
      );
    }

    const ta = await this.wsaa.obtenerTicket(tenantId);
    const ultimo = await this.wsfe.ultimoAutorizado(
      cred,
      ta,
      dto.punto_venta,
      dto.tipo_comprobante,
    );
    const numero = ultimo + 1;
    const fechaComprobante = fechaArgentinaAmd();

    const solicitud: SolicitudCae = {
      tipoComprobante: dto.tipo_comprobante,
      puntoVenta: dto.punto_venta,
      concepto,
      docTipo: dto.doc_tipo,
      docNro: dto.doc_nro.replace(/\D/g, ''),
      importeNeto,
      importeIva,
      importeTotal,
      discriminaIva,
      fechaComprobante,
    };

    const resultado = await this.wsfe.solicitarCae(cred, ta, numero, solicitud);

    if (!resultado.aprobado) {
      // ARCA no consumió el número: no persistimos para no romper la correlatividad.
      const detalle = [...resultado.errores, ...resultado.observaciones];
      this.logger.warn(
        `ARCA rechazó ${COMPROBANTE_LABEL[dto.tipo_comprobante]} PV ${dto.punto_venta}: ${JSON.stringify(detalle)}`,
      );
      throw new BadRequestException({
        message: 'ARCA rechazó el comprobante.',
        rechazo: true,
        observaciones: resultado.observaciones,
        errores: resultado.errores,
      });
    }

    const factura = await this.prisma.factura.create({
      data: {
        tenant_id: tenantId,
        cliente_id: dto.cliente_id ?? null,
        cliente_nombre: dto.cliente_nombre,
        tipo_comprobante: dto.tipo_comprobante,
        punto_venta: dto.punto_venta,
        numero,
        doc_tipo: dto.doc_tipo,
        doc_nro: solicitud.docNro,
        concepto,
        importe_neto: importeNeto,
        importe_iva: importeIva,
        importe_total: importeTotal,
        cae: resultado.cae,
        cae_vencimiento: resultado.caeVencimiento
          ? parseAmd(resultado.caeVencimiento)
          : null,
        estado: 'APROBADA',
        fecha_emision: parseAmd(fechaComprobante),
        items: items as unknown as object,
        observaciones: resultado.observaciones.length
          ? (resultado.observaciones as unknown as object)
          : undefined,
      },
    });

    return {
      id: factura.id,
      tipo_comprobante: factura.tipo_comprobante,
      tipo_label: COMPROBANTE_LABEL[factura.tipo_comprobante],
      punto_venta: factura.punto_venta,
      numero: factura.numero,
      numero_formateado: `${String(factura.punto_venta).padStart(5, '0')}-${String(factura.numero).padStart(8, '0')}`,
      cae: factura.cae,
      cae_vencimiento: factura.cae_vencimiento,
      importe_total: Number(factura.importe_total),
      observaciones: resultado.observaciones,
    };
  }

  async listar(tenantId: string) {
    const facturas = await this.prisma.factura.findMany({
      where: { tenant_id: tenantId },
      orderBy: { created_at: 'desc' },
      take: 100,
    });
    return facturas.map((f) => ({
      id: f.id,
      cliente_nombre: f.cliente_nombre,
      tipo_label:
        COMPROBANTE_LABEL[f.tipo_comprobante] ?? String(f.tipo_comprobante),
      numero_formateado: `${String(f.punto_venta).padStart(5, '0')}-${String(f.numero).padStart(8, '0')}`,
      cae: f.cae,
      estado: f.estado,
      importe_total: Number(f.importe_total),
      fecha_emision: f.fecha_emision,
    }));
  }
}

// ─── Helpers de fecha e importes ─────────────────────────────────────────────
function redondear(n: number): number {
  return Math.round(n * 100) / 100;
}

/** Fecha de hoy en horario de Argentina como AAAAMMDD (formato de ARCA). */
function fechaArgentinaAmd(): string {
  const partes = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Argentina/Buenos_Aires',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
  return partes.replace(/-/g, '');
}

function parseAmd(amd: string): Date {
  const y = Number(amd.slice(0, 4));
  const m = Number(amd.slice(4, 6));
  const d = Number(amd.slice(6, 8));
  return new Date(Date.UTC(y, m - 1, d));
}
