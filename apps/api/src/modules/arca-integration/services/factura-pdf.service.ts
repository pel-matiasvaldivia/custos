import { Injectable, NotFoundException } from '@nestjs/common';
import { format } from 'date-fns';
import { PrismaService } from '../../../prisma/prisma.service';
import {
  COMPROBANTE_LABEL,
  COMPROBANTE_LETRA,
  DOC_TIPO,
} from '../arca.constants';
// @ts-ignore
import pdfMake = require('pdfmake');

interface ItemGuardado {
  descripcion: string;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
}

@Injectable()
export class FacturaPdfService {
  constructor(private prisma: PrismaService) {}

  private getPrinter() {
    pdfMake.setFonts({
      Roboto: {
        normal: 'Helvetica',
        bold: 'Helvetica-Bold',
        italics: 'Helvetica-Oblique',
        bolditalics: 'Helvetica-BoldOblique',
      },
    });
    return pdfMake;
  }

  async generar(facturaId: string, tenantId: string): Promise<Buffer> {
    const factura = await this.prisma.factura.findFirst({
      where: { id: facturaId, tenant_id: tenantId },
    });
    if (!factura) throw new NotFoundException('Comprobante no encontrado.');
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
    });

    const letra = COMPROBANTE_LETRA[factura.tipo_comprobante] ?? 'X';
    const label = COMPROBANTE_LABEL[factura.tipo_comprobante] ?? 'Comprobante';
    const nro = `${String(factura.punto_venta).padStart(5, '0')}-${String(factura.numero).padStart(8, '0')}`;
    const items = (factura.items as unknown as ItemGuardado[]) ?? [];

    const docTipoLabel =
      factura.doc_tipo === DOC_TIPO.CUIT
        ? 'CUIT'
        : factura.doc_tipo === DOC_TIPO.DNI
          ? 'DNI'
          : 'Cons. Final';

    const filas = items.map((i) => [
      { text: i.descripcion, fontSize: 9 },
      { text: String(i.cantidad), alignment: 'right', fontSize: 9 },
      { text: money(i.precio_unitario), alignment: 'right', fontSize: 9 },
      { text: money(i.subtotal), alignment: 'right', fontSize: 9 },
    ]);

    const docDefinition: any = {
      pageMargins: [40, 40, 40, 60],
      defaultStyle: { fontSize: 10, lineHeight: 1.2 },
      content: [
        {
          columns: [
            {
              width: '*',
              stack: [
                {
                  text: tenant?.razon_social || tenant?.nombre || '',
                  bold: true,
                  fontSize: 13,
                },
                { text: `CUIT: ${tenant?.cuit ?? '—'}`, fontSize: 9 },
                { text: tenant?.direccion ?? '', fontSize: 9 },
                { text: condicionIvaLabel(tenant?.condicion_iva), fontSize: 9 },
              ],
            },
            {
              width: 60,
              stack: [
                { text: letra, fontSize: 34, bold: true, alignment: 'center' },
                {
                  text: `Cód. ${factura.tipo_comprobante}`,
                  fontSize: 7,
                  alignment: 'center',
                },
              ],
              margin: [0, 0, 0, 0],
            },
            {
              width: '*',
              stack: [
                { text: label, bold: true, fontSize: 13, alignment: 'right' },
                { text: `Nº ${nro}`, fontSize: 11, alignment: 'right' },
                {
                  text: `Fecha: ${format(factura.fecha_emision, 'dd/MM/yyyy')}`,
                  fontSize: 9,
                  alignment: 'right',
                },
              ],
            },
          ],
        },
        {
          canvas: [
            { type: 'line', x1: 0, y1: 8, x2: 515, y2: 8, lineWidth: 0.5 },
          ],
        },
        {
          margin: [0, 12, 0, 12],
          stack: [
            { text: `Cliente: ${factura.cliente_nombre}`, bold: true },
            { text: `${docTipoLabel}: ${factura.doc_nro}`, fontSize: 9 },
          ],
        },
        {
          table: {
            headerRows: 1,
            widths: ['*', 40, 80, 80],
            body: [
              [
                { text: 'Descripción', bold: true, fontSize: 9 },
                { text: 'Cant.', bold: true, alignment: 'right', fontSize: 9 },
                {
                  text: 'P. Unit.',
                  bold: true,
                  alignment: 'right',
                  fontSize: 9,
                },
                {
                  text: 'Subtotal',
                  bold: true,
                  alignment: 'right',
                  fontSize: 9,
                },
              ],
              ...filas,
            ],
          },
          layout: 'lightHorizontalLines',
        },
        {
          margin: [0, 12, 0, 0],
          columns: [
            { width: '*', text: '' },
            {
              width: 200,
              table: {
                widths: ['*', 80],
                body: [
                  [
                    { text: 'Neto Gravado', fontSize: 9 },
                    {
                      text: money(Number(factura.importe_neto)),
                      alignment: 'right',
                      fontSize: 9,
                    },
                  ],
                  [
                    { text: 'IVA 21%', fontSize: 9 },
                    {
                      text: money(Number(factura.importe_iva)),
                      alignment: 'right',
                      fontSize: 9,
                    },
                  ],
                  [
                    { text: 'TOTAL', bold: true },
                    {
                      text: money(Number(factura.importe_total)),
                      alignment: 'right',
                      bold: true,
                    },
                  ],
                ],
              },
              layout: 'noBorders',
            },
          ],
        },
        {
          margin: [0, 24, 0, 0],
          stack: [
            { text: `CAE: ${factura.cae ?? '—'}`, bold: true, fontSize: 11 },
            {
              text: `Vto. CAE: ${factura.cae_vencimiento ? format(factura.cae_vencimiento, 'dd/MM/yyyy') : '—'}`,
              fontSize: 9,
            },
            {
              text: 'Comprobante autorizado por ARCA (ex-AFIP). Documento generado electrónicamente por CustOS.',
              fontSize: 7,
              color: '#666',
              margin: [0, 6, 0, 0],
            },
          ],
        },
      ],
    };

    return this.getPrinter().createPdf(docDefinition).getBuffer();
  }
}

function money(n: number): string {
  return `$${n.toLocaleString('es-AR', { minimumFractionDigits: 2 })}`;
}

function condicionIvaLabel(c: string | null | undefined): string {
  const map: Record<string, string> = {
    RESPONSABLE_INSCRIPTO: 'IVA Responsable Inscripto',
    MONOTRIBUTO: 'Responsable Monotributo',
    EXENTO: 'IVA Exento',
    CONSUMIDOR_FINAL: 'Consumidor Final',
  };
  return c ? (map[c] ?? c) : '';
}
