import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';
import { CreateNovedadDto } from './dto/create-novedad.dto';
import { FiltrarNovedadesDto } from './dto/filtrar-novedades.dto';
// @ts-ignore - pdfmake no trae tipos; se usa el runtime directamente.
import pdfMake = require('pdfmake');
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

@Injectable()
export class NovedadService {
  constructor(
    private prisma: PrismaService,
    private storage: StorageService,
  ) {}

  /** Arma el filtro Prisma común al listado y al reporte PDF. */
  private buildWhere(tenantId: string, f: FiltrarNovedadesDto) {
    const where: any = { tenant_id: tenantId };
    if (f.puestoId) where.puesto_id = f.puestoId;
    if (f.objetivoId) where.puesto = { objetivo_id: f.objetivoId };
    if (f.vigiladorId) where.vigilador_id = f.vigiladorId;
    if (f.tipo) where.tipo = f.tipo;
    if (f.prioridad) where.prioridad = f.prioridad;
    if (f.desde || f.hasta) {
      where.created_at = {
        gte: f.desde ? new Date(f.desde) : undefined,
        lte: f.hasta ? new Date(`${f.hasta}T23:59:59`) : undefined,
      };
    }
    if (f.q) where.descripcion = { contains: f.q, mode: 'insensitive' };
    return where;
  }

  async create(tenantId: string, data: CreateNovedadDto) {
    const novedad = await this.prisma.novedad.create({
      data: {
        tenant_id: tenantId,
        puesto_id: data.puesto_id,
        vigilador_id: data.vigilador_id,
        tipo: data.tipo,
        prioridad: data.prioridad ?? 'NORMAL',
        descripcion: data.descripcion,
        adjuntos: data.adjuntos ?? [],
      },
      include: {
        puesto: true,
        vigilador: true,
      },
    });

    // Adelanto de sueldo: la descripción trae "[ADELANTO monto=NNN cuotas=N]".
    // Se registra en el ledger de adelantos para que Liquidaciones lo descuente.
    // Una "[SOLICITUD ADELANTO ...]" (pedida desde el móvil) NO entra al
    // ledger: queda pendiente hasta que la oficina la apruebe (aprobarAdelanto).
    if (
      data.tipo === 'ADELANTO_SUELDO' &&
      data.vigilador_id &&
      !(data.descripcion || '').includes('[SOLICITUD ADELANTO')
    ) {
      const monto = parseFloat(/monto=(\d+(?:\.\d+)?)/.exec(data.descripcion || '')?.[1] ?? '0');
      const cuotas = parseInt(/cuotas=(\d+)/.exec(data.descripcion || '')?.[1] ?? '1', 10);
      if (monto > 0) {
        await this.prisma.adelanto.create({
          data: {
            tenant_id: tenantId,
            vigilador_id: data.vigilador_id,
            novedad_id: novedad.id,
            monto,
            cuotas: Math.min(Math.max(cuotas, 1), 6),
            saldo: monto,
            estado: 'VIGENTE',
          },
        });
      }
    }

    return novedad;
  }

  /**
   * Aprueba una solicitud de adelanto pedida desde el móvil: crea la fila del
   * ledger `adelantos` (que Liquidaciones descuenta al cerrar el período) y
   * marca la novedad como aprobada. Idempotente: si el adelanto ya existe
   * para esa novedad, no lo duplica.
   */
  async aprobarAdelanto(tenantId: string, novedadId: string) {
    const novedad = await this.buscarSolicitudAdelanto(tenantId, novedadId);

    const yaCreado = await this.prisma.adelanto.findFirst({
      where: { tenant_id: tenantId, novedad_id: novedadId },
      select: { id: true },
    });
    if (yaCreado) {
      throw new BadRequestException('Esta solicitud ya fue aprobada.');
    }

    const monto = parseFloat(
      /monto=(\d+(?:\.\d+)?)/.exec(novedad.descripcion)?.[1] ?? '0',
    );
    const cuotas = parseInt(
      /cuotas=(\d+)/.exec(novedad.descripcion)?.[1] ?? '1',
      10,
    );
    if (!(monto > 0) || !novedad.vigilador_id) {
      throw new BadRequestException(
        'La solicitud no tiene un monto o vigilador válidos.',
      );
    }

    await this.prisma.adelanto.create({
      data: {
        tenant_id: tenantId,
        vigilador_id: novedad.vigilador_id,
        novedad_id: novedad.id,
        monto,
        cuotas: Math.min(Math.max(cuotas, 1), 6),
        saldo: monto,
        estado: 'VIGENTE',
      },
    });

    return this.prisma.novedad.update({
      where: { id: novedad.id },
      data: {
        descripcion: novedad.descripcion.replace(
          '[SOLICITUD ADELANTO',
          '[ADELANTO APROBADO',
        ),
      },
      include: { puesto: true, vigilador: true },
    });
  }

  /** Rechaza una solicitud de adelanto pedida desde el móvil (sin tocar el ledger). */
  async rechazarAdelanto(tenantId: string, novedadId: string) {
    const novedad = await this.buscarSolicitudAdelanto(tenantId, novedadId);
    return this.prisma.novedad.update({
      where: { id: novedad.id },
      data: {
        descripcion: novedad.descripcion.replace(
          '[SOLICITUD ADELANTO',
          '[ADELANTO RECHAZADO',
        ),
      },
      include: { puesto: true, vigilador: true },
    });
  }

  private async buscarSolicitudAdelanto(tenantId: string, novedadId: string) {
    const novedad = await this.prisma.novedad.findFirst({
      where: { id: novedadId, tenant_id: tenantId, tipo: 'ADELANTO_SUELDO' },
    });
    if (!novedad) {
      throw new NotFoundException('Solicitud de adelanto no encontrada.');
    }
    if (!novedad.descripcion.includes('[SOLICITUD ADELANTO')) {
      throw new BadRequestException(
        'La novedad no es una solicitud de adelanto pendiente.',
      );
    }
    return novedad;
  }

  async findAll(tenantId: string, filtros?: FiltrarNovedadesDto) {
    const f = filtros ?? ({} as FiltrarNovedadesDto);
    const skip = f.skip ?? 0;
    const take = f.limit ?? 50;
    const where = this.buildWhere(tenantId, f);

    const [data, total] = await Promise.all([
      this.prisma.novedad.findMany({
        where,
        include: { puesto: true, vigilador: true },
        orderBy: { created_at: 'desc' },
        skip,
        take,
      }),
      this.prisma.novedad.count({ where }),
    ]);

    return { data, total, page: f.page ?? 1, limit: take };
  }

  /** Reporte PDF de novedades aplicando los mismos filtros del listado. */
  async generarReportePdf(tenantId: string, filtros: FiltrarNovedadesDto) {
    const where = this.buildWhere(tenantId, filtros);
    const novedades = await this.prisma.novedad.findMany({
      where,
      include: { puesto: { include: { objetivo: true } }, vigilador: true },
      orderBy: { created_at: 'desc' },
      take: 1000,
    });

    // pdfmake 0.3.x: el export es una instancia singleton (no un constructor).
    // El patrón viejo `new printer(fonts)` + createPdfKitDocument revienta en
    // runtime ("printer is not a constructor") → el reporte devolvía 500.
    pdfMake.setFonts({
      Roboto: {
        normal: 'Helvetica',
        bold: 'Helvetica-Bold',
        italics: 'Helvetica-Oblique',
        bolditalics: 'Helvetica-BoldOblique',
      },
    });

    const docDefinition: any = {
      pageMargins: [32, 40, 32, 40],
      content: [
        { text: 'CustOS · Reporte de Novedades', style: 'header' },
        {
          text: `Generado el ${format(new Date(), "dd 'de' MMMM yyyy, HH:mm", { locale: es })} · ${novedades.length} novedad(es)`,
          style: 'subheader',
        },
        { text: '\n' },
        {
          table: {
            headerRows: 1,
            widths: ['auto', 'auto', '*', 'auto', '*'],
            body: [
              [
                { text: 'FECHA', style: 'th' },
                { text: 'PRIORIDAD', style: 'th' },
                { text: 'OBJETIVO / PUESTO', style: 'th' },
                { text: 'VIGILADOR', style: 'th' },
                { text: 'TIPO / DESCRIPCIÓN', style: 'th' },
              ],
              ...novedades.map((n) => [
                format(n.created_at, 'dd/MM/yy HH:mm'),
                n.prioridad,
                `${n.puesto?.objetivo?.nombre ?? 'S/D'}\n${n.puesto?.nombre ?? 'General'}`,
                n.vigilador ? `${n.vigilador.apellido}, ${n.vigilador.nombre}` : 'S/D',
                `${n.tipo}\n${n.descripcion ?? ''}`,
              ]),
            ],
          },
          layout: {
            fillColor: (rowIndex: number) => (rowIndex === 0 ? '#0e1f3a' : rowIndex % 2 === 0 ? '#f4f6fb' : null),
          },
        },
      ],
      styles: {
        header: { fontSize: 20, bold: true, color: '#0e1f3a' },
        subheader: { fontSize: 9, italics: true, color: '#5c6b86' },
        th: { fontSize: 9, bold: true, color: '#ffffff', margin: [0, 4, 0, 4] },
      },
      defaultStyle: { fontSize: 8, color: '#0e1f3a' },
    };

    const buffer: Buffer = await pdfMake.createPdf(docDefinition).getBuffer();
    return buffer;
  }

  /**
   * Streamea un adjunto de la novedad (foto/audio subidos desde el móvil).
   * `adjuntos` guarda keys de MinIO; la URL firmada de MinIO apunta al hostname
   * interno (no resoluble desde el navegador), así que se sirve a través de la
   * API, validando que la novedad sea del tenant.
   */
  async obtenerAdjunto(tenantId: string, novedadId: string, indice: number) {
    const novedad = await this.prisma.novedad.findFirst({
      where: { id: novedadId, tenant_id: tenantId },
      select: { adjuntos: true },
    });
    if (!novedad) throw new NotFoundException('Novedad no encontrada.');
    const key = novedad.adjuntos[indice];
    if (!key) throw new NotFoundException('Adjunto no encontrado.');
    return this.storage.descargar(key);
  }

  async findByPuesto(tenantId: string, puestoId: string) {
    return this.prisma.novedad.findMany({
      where: { tenant_id: tenantId, puesto_id: puestoId },
      include: { vigilador: true },
      orderBy: { created_at: 'desc' },
    });
  }
}
