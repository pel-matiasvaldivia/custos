import { Injectable, NotFoundException } from '@nestjs/common';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';
import { ContratoConfigService } from '../contrato-config/contrato-config.service';
import { parseBlocks, PDF_STYLES } from '../contrato/html-to-pdf-content.util';
// @ts-ignore
import pdfMake = require('pdfmake');

@Injectable()
export class CotizacionPdfService {
  constructor(
    private prisma: PrismaService,
    private storageService: StorageService,
    private contratoConfigService: ContratoConfigService,
  ) {}

  /**
   * Corre queries crudas (`$queryRaw`/`$executeRaw`) dentro de una transacción
   * con `app.current_tenant` seteado. El wrapper de RLS de PrismaService solo
   * intercepta operaciones de modelo (`$allModels`), NO las crudas, así que sin
   * esto las escrituras a tablas con FORCE ROW LEVEL SECURITY (cotizacion_documentos,
   * cotizaciones) violan la política de aislamiento y fallan con 500.
   */
  private async conTenant<T>(
    tenantId: string,
    fn: (tx: any) => Promise<T>,
  ): Promise<T> {
    return this.prisma.$transaction(async (tx: any) => {
      await tx.$executeRaw`SELECT set_config('app.current_tenant', ${tenantId}, true)`;
      return fn(tx);
    });
  }

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

  private async buildImgHtml(
    key: string | null | undefined,
    width: number,
  ): Promise<string> {
    if (!key) return '';
    try {
      const { stream, contentType } = await this.storageService.descargar(key);
      const chunks: Buffer[] = [];
      for await (const chunk of stream) chunks.push(chunk as Buffer);
      const base64 = Buffer.concat(chunks).toString('base64');
      return `<img src="data:${contentType};base64,${base64}" width="${width}" />`;
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

    // Logo y firma del director salen de la config de contrato (ContratoConfigService
    // usa PrismaAdmin y filtra por tenant explícitamente, evitando el bypass de RLS
    // que sufren las queries crudas de este servicio).
    const config = await this.contratoConfigService.findOne(tenantId);
    const logoHtml = await this.buildImgHtml(config.logo_key, 120);
    const firmaImgHtml = await this.buildImgHtml(config.firma_key, 140);

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

    // Pie de firma del director/responsable comercial. Se muestra solo si el
    // tenant cargó una firma o al menos el nombre del firmante en Configuración.
    const firmaNombre = config.firma_nombre ?? '';
    const firmaCargo = config.firma_cargo ?? '';
    const firma =
      firmaImgHtml || firmaNombre
        ? `<table style="border:none">
  <tr>
    <td style="border:none">${firmaImgHtml}<p><strong>${firmaNombre}</strong></p><p>${firmaCargo}</p></td>
  </tr>
</table>`
        : '';

    const bloques = [encabezado, hr, subtitulo, clienteInfo, tablaItems, totalLinea, hr, nota];
    if (firma) bloques.push(firma);
    return bloques.join('\n');
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

    // Todo dentro de una misma transacción con el tenant seteado: cotizacion_documentos
    // y cotizaciones tienen FORCE ROW LEVEL SECURITY, y estas queries crudas no pasan
    // por el wrapper de RLS de PrismaService (que solo cubre operaciones de modelo).
    await this.conTenant(tenantId, async (tx) => {
      const ultimaVersion = await tx.$queryRaw<{ max: number | null }[]>`
        SELECT MAX(version) as max FROM cotizacion_documentos WHERE cotizacion_id = ${cotizacionId}::uuid
      `;
      const nextVersion = (ultimaVersion[0]?.max ?? 0) + 1;

      await tx.$executeRaw`
        INSERT INTO cotizacion_documentos (id, tenant_id, cotizacion_id, version, documento_key, generado_at)
        VALUES (gen_random_uuid(), ${tenantId}::uuid, ${cotizacionId}::uuid, ${nextVersion}, ${subida.key}, ${ahora})
      `;
      await tx.$executeRaw`
        UPDATE cotizaciones
        SET documento_key = ${subida.key}, documento_generado_at = ${ahora}
        WHERE id = ${cotizacionId}::uuid
      `;
    });

    return buffer;
  }

  async findVersiones(cotizacionId: string, tenantId: string) {
    // Verify ownership
    const cot = await this.prisma.cotizacion.findFirst({
      where: { id: cotizacionId, tenant_id: tenantId },
    });
    if (!cot) throw new NotFoundException('Cotización no encontrada.');

    return this.conTenant(tenantId, (tx) =>
      tx.$queryRaw<
        { id: string; version: number; documento_key: string; generado_at: Date; notas: string | null }[]
      >`
        SELECT id, version, documento_key, generado_at, notas
        FROM cotizacion_documentos
        WHERE cotizacion_id = ${cotizacionId}::uuid
        ORDER BY version DESC
      `,
    );
  }

  async descargarDocumentoGuardado(documentoKey: string) {
    return this.storageService.descargar(documentoKey);
  }
}
