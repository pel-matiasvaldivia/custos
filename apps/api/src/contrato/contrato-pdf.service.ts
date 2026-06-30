import { Injectable, NotFoundException } from '@nestjs/common';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';
import { ContratoConfigService } from '../contrato-config/contrato-config.service';
import { parseBlocks, PDF_STYLES } from './html-to-pdf-content.util';
// @ts-ignore
import pdfMake = require('pdfmake');

@Injectable()
export class ContratoPdfService {
  constructor(
    private prisma: PrismaService,
    private storageService: StorageService,
    private contratoConfigService: ContratoConfigService,
  ) {}

  // pdfmake 0.3.x: el export ya es una instancia singleton, no un constructor;
  // configurar fuentes y generar el doc se hace todo sobre esa misma instancia.
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

  private buildObjetivosTablaHtml(contrato: any): string {
    const filas: { puesto: string; horas: string }[] = [];

    if (contrato.cotizacion?.items?.length) {
      for (const item of contrato.cotizacion.items) {
        filas.push({
          puesto: item.puesto_nombre,
          horas: `${item.horas_mensuales} hs/mes`,
        });
      }
    } else if (contrato.objetivo) {
      filas.push({ puesto: contrato.objetivo.nombre, horas: '-' });
    }

    if (!filas.length) {
      filas.push({ puesto: 'A definir', horas: '-' });
    }

    const filasHtml = filas
      .map((f) => `<tr><td>${f.puesto}</td><td>${f.horas}</td></tr>`)
      .join('');

    return `<table><tr><th>Puesto / Objetivo</th><th>Horas</th></tr>${filasHtml}</table>`;
  }

  private buildFacturacionResumen(contrato: any): string {
    const f = contrato.facturacion;
    if (!f) return 'A definir al activar el contrato.';
    if (f.modo === 'ABONO_FIJO' && f.abono_mensual) {
      return `Abono mensual fijo de $${Number(f.abono_mensual).toLocaleString('es-AR')}.`;
    }
    if (f.tarifa_hora) {
      return `Facturación por hora trabajada (${f.modo === 'POR_PLANIFICADO' ? 'según planificación' : 'según horas reales'}), tarifa de $${Number(f.tarifa_hora).toLocaleString('es-AR')}/hora.`;
    }
    return 'A definir al activar el contrato.';
  }

  private async buildFirmaImagenHtml(
    firmaKey: string | null | undefined,
  ): Promise<string> {
    if (!firmaKey) return '';
    try {
      const { stream, contentType } =
        await this.storageService.descargar(firmaKey);
      const chunks: Buffer[] = [];
      for await (const chunk of stream) chunks.push(chunk as Buffer);
      const base64 = Buffer.concat(chunks).toString('base64');
      return `<img src="data:${contentType};base64,${base64}" width="120" />`;
    } catch {
      return '';
    }
  }

  /** Reemplaza los placeholders {{...}} de la plantilla con los datos del contrato. Usado tanto para
   * previsualizar/editar el HTML en el frontend como, luego de editarlo, para generar el PDF final. */
  async mergeHtml(contratoId: string, tenantId: string): Promise<string> {
    const contrato = await this.prisma.contrato.findFirst({
      where: { id: contratoId, tenant_id: tenantId },
      include: {
        cliente: true,
        objetivo: true,
        facturacion: true,
        cotizacion: { include: { items: true } },
      },
    });
    if (!contrato) throw new NotFoundException('Contrato no encontrado.');

    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
    });
    const config = await this.contratoConfigService.findOne(tenantId);

    const placeholders: Record<string, string> = {
      tenant_nombre: tenant?.nombre ?? '',
      tenant_razon_social: tenant?.razon_social ?? tenant?.nombre ?? '',
      tenant_cuit: tenant?.cuit ?? '',
      tenant_direccion: tenant?.direccion ?? '',
      cliente_nombre: contrato.cliente?.razon_social ?? contrato.cliente_nombre,
      cliente_cuit: contrato.cliente?.cuit ?? '',
      cliente_domicilio: contrato.cliente?.domicilio ?? '',
      contrato_codigo: contrato.codigo,
      contrato_inicio: contrato.inicio
        ? format(contrato.inicio, "dd 'de' MMMM 'de' yyyy", { locale: es })
        : 'a definir',
      objetivos_tabla: this.buildObjetivosTablaHtml(contrato),
      facturacion_resumen: this.buildFacturacionResumen(contrato),
      fecha_actual: format(new Date(), "dd 'de' MMMM 'de' yyyy", {
        locale: es,
      }),
      firma_imagen: await this.buildFirmaImagenHtml(config.firma_key),
      firma_nombre: config.firma_nombre ?? '',
      firma_cargo: config.firma_cargo ?? '',
    };

    return config.plantilla_html.replace(
      /\{\{(\w+)\}\}/g,
      (_match: string, key: string) => placeholders[key] ?? '',
    );
  }

  /** Convierte el HTML (ya editado/confirmado por el usuario) a un PDF, lo sube a almacenamiento
   * y registra el documento en el Contrato. Devuelve el stream del PDF para descarga inmediata. */
  async generarYGuardarPdf(contratoId: string, tenantId: string, html: string) {
    const contrato = await this.prisma.contrato.findFirst({
      where: { id: contratoId, tenant_id: tenantId },
    });
    if (!contrato) throw new NotFoundException('Contrato no encontrado.');

    const content = parseBlocks(html);
    const docDefinition: any = {
      content,
      styles: PDF_STYLES,
      defaultStyle: { fontSize: 10, lineHeight: 1.2 },
      pageMargins: [40, 40, 40, 40],
    };

    const pdfDoc = this.getPrinter().createPdf(docDefinition);
    const buffer: Buffer = await pdfDoc.getBuffer();

    const subida = await this.storageService.subir(
      buffer,
      `${contrato.codigo}.pdf`,
      'application/pdf',
      'contratos',
    );

    const ahora = new Date();

    // Determine next version number for this contract
    const ultimaVersion = await this.prisma.$queryRaw<{ max: number | null }[]>`
      SELECT MAX(version) as max FROM contrato_documentos WHERE contrato_id = ${contratoId}::uuid
    `;
    const nextVersion = (ultimaVersion[0]?.max ?? 0) + 1;

    // Persist version entry and update snapshot on Contrato in a transaction
    const esBorrador = contrato.estado === 'BORRADOR';
    await this.prisma.$transaction([
      this.prisma.$executeRaw`
        INSERT INTO contrato_documentos (id, tenant_id, contrato_id, version, documento_key, generado_at)
        VALUES (gen_random_uuid(), ${tenantId}::uuid, ${contratoId}::uuid, ${nextVersion}, ${subida.key}, ${ahora})
      `,
      this.prisma.contrato.update({
        where: { id: contratoId },
        data: {
          documento_key: subida.key,
          documento_generado_at: ahora,
          // First document generation activates the contract
          ...(esBorrador ? { estado: 'ACTIVO' } : {}),
        },
      }),
    ]);

    // Auto-activate the linked Objetivo when contract goes from BORRADOR → ACTIVO
    if (esBorrador && contrato.objetivo_id) {
      await this.prisma.objetivo.updateMany({
        where: { id: contrato.objetivo_id, estado: 'INACTIVO' },
        data: { estado: 'ACTIVO' },
      });
    }

    return buffer;
  }

  async descargarDocumentoGuardado(documentoKey: string) {
    return this.storageService.descargar(documentoKey);
  }
}
