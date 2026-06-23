import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as PdfPrinter from 'pdfmake';
// @ts-ignore
import printer = require('pdfmake');
import * as ExcelJS from 'exceljs';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

@Injectable()
export class ReportsService {
  private readonly logger = new Logger(ReportsService.name);

  constructor(private readonly prisma: PrismaService) {}

  private getPrinter() {
    const fonts = {
      Roboto: {
        normal: 'Helvetica',
        bold: 'Helvetica-Bold',
        italics: 'Helvetica-Oblique',
        bolditalics: 'Helvetica-BoldOblique',
      },
    };
    // @ts-ignore
    return new printer(fonts);
  }

  async generateIncidentPdf(tenantId: string, filters: any) {
    const incidents = await this.prisma.incidente.findMany({
      where: {
        tenant_id: tenantId,
        abierto_el: {
          gte: filters.desde ? new Date(filters.desde) : undefined,
          lte: filters.hasta ? new Date(filters.hasta) : undefined,
        },
      },
      include: {
        objetivo: true,
        eventos: true,
      },
      orderBy: { abierto_el: 'desc' },
    });

    const docDefinition: any = {
      content: [
        { text: 'CustOS ERP - Reporte de Incidentes', style: 'header' },
        {
          text: `Generado el: ${format(new Date(), "dd 'de' MMMM 'de' yyyy, HH:mm", { locale: es })}`,
          style: 'subheader',
        },
        { text: '\n' },
        {
          table: {
            headerRows: 1,
            widths: ['auto', 'star', 'auto', 'auto', 'auto'],
            body: [
              [
                { text: 'CÓDIGO', style: 'tableHeader' },
                { text: 'TIPO / OBJETIVO', style: 'tableHeader' },
                { text: 'APERTURA', style: 'tableHeader' },
                { text: 'PRIORIDAD', style: 'tableHeader' },
                { text: 'ESTADO', style: 'tableHeader' },
              ],
              ...incidents.map((inc) => [
                inc.codigo,
                `${inc.tipo}\n${inc.objetivo?.nombre || 'S/D'}`,
                format(inc.abierto_el, 'dd/MM HH:mm'),
                inc.severidad,
                inc.estado,
              ]),
            ],
          },
        },
      ],
      styles: {
        header: { fontSize: 22, bold: true, color: '#101828' },
        subheader: { fontSize: 10, italic: true, color: '#667085' },
        tableHeader: {
          fontSize: 10,
          bold: true,
          fillColor: '#f9fafb',
          margin: [0, 5, 0, 5],
        },
      },
      defaultStyle: { fontSize: 9 },
    };

    const printer = this.getPrinter();
    return printer.createPdfKitDocument(docDefinition);
  }

  async generateIncidentExcel(tenantId: string, filters: any) {
    const incidents = await this.prisma.incidente.findMany({
      where: {
        tenant_id: tenantId,
        abierto_el: {
          gte: filters.desde ? new Date(filters.desde) : undefined,
          lte: filters.hasta ? new Date(filters.hasta) : undefined,
        },
      },
      include: { objetivo: true },
      orderBy: { abierto_el: 'desc' },
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Incidentes');

    worksheet.columns = [
      { header: 'Código', key: 'codigo', width: 15 },
      { header: 'Tipo', key: 'tipo', width: 25 },
      { header: 'Objetivo', key: 'objetivo', width: 30 },
      { header: 'Apertura', key: 'abierto_el', width: 20 },
      { header: 'Prioridad', key: 'severidad', width: 15 },
      { header: 'Estado', key: 'estado', width: 15 },
    ];

    incidents.forEach((inc) => {
      worksheet.addRow({
        codigo: inc.codigo,
        tipo: inc.tipo,
        objetivo: inc.objetivo?.nombre || 'N/A',
        abierto_el: format(inc.abierto_el, 'yyyy-MM-dd HH:mm:ss'),
        severidad: inc.severidad,
        estado: inc.estado,
      });
    });

    // Formatting
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'F9FAFB' },
    };

    return workbook;
  }
}
