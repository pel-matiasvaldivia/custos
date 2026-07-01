import { Injectable, NotFoundException } from '@nestjs/common';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';
import { parseBlocks, PDF_STYLES } from '../contrato/html-to-pdf-content.util';
// @ts-ignore
import pdfMake = require('pdfmake');

@Injectable()
export class CotizacionPdfService {
  constructor(
    private prisma: PrismaService,
    private storageService: StorageService,
  ) {}

  private getPrinter() {
    const fonts = {
      Roboto: {
        normal: 'Helvetica',
        bold: 'Helvetica-Bold',
        italics: 'Helvetica-Oblique',
        bolditalics: 'Helvetica-BoldOblique',
      },
    };
    pdfMake.setFonts(fonts);
    return pdfMake;
  }

  private async buildLogoBase64(logoKey: string | null | undefined): Promise<string> {
    if (!logoKey) return '';
    try {
      const { stream, contentType } = await this.storageService.descargar(logoKey);
      const chunks: Buffer[] = [];
      for await (const chunk of stream) chunks.push(chunk as Buffer);
      const base64 = Buffer.concat(chunks).toString('base64');
      return `<img src="data:${contentType};base64,${base64}" width="120" />`;
    } catch {
      return '';
    }
  }

  /** Genera el HTML de la cotización con encabezado, tabla de items y totales. */
  async buildHtml(cotizacionId: string, tenantId: string): Promise<string> {
    const cotizacion = await this.prisma.cotizacion.findFirst({
      where: { id: cotizacionId, tenant_id: tenantId },
      include: { items: true },
    });
    if (!cotizacion) throw new NotFoundException('Cotización no encontrada.');

    const tenant = await this.prisma.tenant.findUnique({ where: { id: tenantId } });

    // Load logo_key from configuraciones_contrato using $queryRaw (new column)
    const configRows = await this.prisma.$queryRaw<{ logo_key: string | null }[]>`
      SELECT logo_key FROM configuraciones_contrato WHERE tenant_id = ${tenantId}::uuid LIMIT 1
    `;
    const logoKey = configRows[0]?.logo_key ?? null;
    const logoHtml = await this.buildLogoBase64(logoKey);

    const cotId = `COT-${cotizacionId.slice(0, 8).toUpperCase()}`;
    const fechaCreacion = format(cotizacion.created_at, "dd/MM/yyyy", { locale: es });
    const fechaVencimiento = format(cotizacion.vencimiento, "dd/MM/yyyy", { locale: es });

    // Header: 3-column table: [logo] | [tenant info] | [quote meta]
    const encabezado = `
<table>
  <tr>
    <td>${logoHtml || (tenant?.nombre ?? '')}</td>
    <td><p><strong>${tenant?.nombre ?? ''}</strong></p><p>CUIT: ${tenant?.cuit ?? ''}</p><p>${tenant?.direccion ?? ''}</p></td>
    <td><p><strong>${cotId}</strong></p><p>Fecha: ${fechaCreacion}</p><p>Vence: ${fechaVencimiento}</p></td>
  </tr>
</table>`;

    const hr = '<hr/>';

    const subtitulo = `<h2>Cotización de Servicios de Seguridad</h2>`;
    const clienteInfo = `<p>Cliente: <strong>${cotizacion.cliente_nombre}</strong></p>`;

    const TIPO_LABEL: Record<string, string> = {
      HORAS_HOMBRE: 'Horas Hombre',
      HORAS_VEHICULO: 'Horas Vehículo',
      HORAS_SERVICIO_ESPECIAL: 'Servicios Especiales',
    };

    // Items table
    const filaItems = cotizacion.items
      .map(
        (i) =>
          `<tr><td>${i.puesto_nombre}</td><td>${TIPO_LABEL[(i as any).tipo] ?? (i as any).tipo ?? 'Horas Hombre'}</td><td>${(i as any).horas_mensuales} hs/mes</td><td>$${Number(i.subtotal).toLocaleString('es-AR', { minimumFractionDigits: 2 })}/mes</td></tr>`,
      )
      .join('');
    const tablaItems = `<table>
  <tr><th>Puesto / Servicio</th><th>Tipo de Hora</th><th>Horas mensuales</th><th>Subtotal mensual</th></tr>
  ${filaItems}
</table>`;

    const totalLinea = `<p><strong>Total mensual: $${Number(cotizacion.total_mensual).toLocaleString('es-AR', { minimumFractionDigits: 2 })}</strong></p>`;

    const nota = `<p>Esta cotización tiene validez hasta el ${fechaVencimiento}. Los valores indicados no incluyen IVA salvo aclaración expresa.</p>`;

    return [encabezado, hr, subtitulo, clienteInfo, tablaItems, totalLinea, hr, nota].join('\n');
  }

  /** Convierte el HTML (confirmado por el usuario) a PDF, sube a storage y registra versión. */
  async generarYGuardarPdf(cotizacionId: string, tenantId: string, html: string): Promise<Buffer> {
    const cotizacion = await this.prisma.cotizacion.findFirst({
      where: { id: cotizacionId, tenant_id: tenantId },
    });
    if (!cotizacion) throw new NotFoundException('Cotización no encontrada.');

    const content = parseBlocks(html);
    const docDefinition: any = {
      content,
      styles: PDF_STYLES,
      defaultStyle: { fontSize: 10, lineHeight: 1.2 },
      pageMargins: [40, 40, 40, 40],
    };

    const pdfDoc = this.getPrinter().createPdf(docDefinition);
    const buffer: Buffer = await pdfDoc.getBuffer();

    const cotId = `COT-${cotizacionId.slice(0, 8).toUpperCase()}`;
    const subida = await this.storageService.subir(
      buffer,
      `${cotId}.pdf`,
      'application/pdf',
      'cotizaciones',
    );

    const ahora = new Date();

    const ultimaVersion = await this.prisma.$queryRaw<{ max: number | null }[]>`
      SELECT MAX(version) as max FROM cotizacion_documentos WHERE cotizacion_id = ${cotizacionId}::uuid
    `;
    const nextVersion = (ultimaVersion[0]?.max ?? 0) + 1;

    await this.prisma.$transaction([
      this.prisma.$executeRaw`
        INSERT INTO cotizacion_documentos (id, tenant_id, cotizacion_id, version, documento_key, generado_at)
        VALUES (gen_random_uuid(), ${tenantId}::uuid, ${cotizacionId}::uuid, ${nextVersion}, ${subida.key}, ${ahora})
      `,
      this.prisma.$executeRaw`
        UPDATE cotizaciones
        SET documento_key = ${subida.key}, documento_generado_at = ${ahora}
        WHERE id = ${cotizacionId}::uuid
      `,
    ]);

    return buffer;
  }

  async findVersiones(cotizacionId: string, tenantId: string) {
    // Verify ownership
    const cot = await this.prisma.cotizacion.findFirst({
      where: { id: cotizacionId, tenant_id: tenantId },
    });
    if (!cot) throw new NotFoundException('Cotización no encontrada.');

    return this.prisma.$queryRaw<
      { id: string; version: number; documento_key: string; generado_at: Date; notas: string | null }[]
    >`
      SELECT id, version, documento_key, generado_at, notas
      FROM cotizacion_documentos
      WHERE cotizacion_id = ${cotizacionId}::uuid
      ORDER BY version DESC
    `;
  }

  async descargarDocumentoGuardado(documentoKey: string) {
    return this.storageService.descargar(documentoKey);
  }
}
