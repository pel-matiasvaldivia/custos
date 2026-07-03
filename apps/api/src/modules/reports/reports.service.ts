import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
// @ts-ignore - pdfmake no trae tipos; se usa el runtime directamente.
import pdfMake = require('pdfmake');
import * as ExcelJS from 'exceljs';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

@Injectable()
export class ReportsService {
  private readonly logger = new Logger(ReportsService.name);

  constructor(private readonly prisma: PrismaService) {}

  // pdfmake 0.3.x: el export es una instancia singleton (no un constructor);
  // el patrón viejo `new printer(fonts)` reventaba en runtime con 500.
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

    const buffer: Buffer = await this.getPrinter()
      .createPdf(docDefinition)
      .getBuffer();
    return buffer;
  }

  /**
   * Estadísticas reales del período para alimentar los KPIs y gráficos de la
   * página de Informes. Antes la UI mostraba números hardcodeados; ahora todo
   * se computa sobre los incidentes del tenant en el rango indicado.
   */
  async getEstadisticas(
    tenantId: string,
    filters: { desde?: string; hasta?: string },
  ) {
    const desde = filters.desde
      ? new Date(`${filters.desde}T00:00:00`)
      : new Date(Date.now() - 30 * 86400000);
    const hasta = filters.hasta
      ? new Date(`${filters.hasta}T23:59:59`)
      : new Date();

    const incidentes = await this.prisma.incidente.findMany({
      where: { tenant_id: tenantId, abierto_el: { gte: desde, lte: hasta } },
      select: {
        tipo: true,
        severidad: true,
        estado: true,
        abierto_el: true,
        tomado_el: true,
        resuelto_el: true,
      },
    });

    const total = incidentes.length;
    const resueltos = incidentes.filter((i) => i.estado === 'RESUELTO').length;

    const promedio = (valores: number[]) =>
      valores.length
        ? Math.round(valores.reduce((a, b) => a + b, 0) / valores.length)
        : null;

    const minutos = (fin: Date, inicio: Date) =>
      (fin.getTime() - inicio.getTime()) / 60000;

    const tiempoMedioRespuestaMin = promedio(
      incidentes
        .filter((i) => i.tomado_el)
        .map((i) => minutos(i.tomado_el as Date, i.abierto_el)),
    );
    const tiempoMedioResolucionMin = promedio(
      incidentes
        .filter((i) => i.resuelto_el)
        .map((i) => minutos(i.resuelto_el as Date, i.abierto_el)),
    );

    // Rango largo (> ~2 meses) se agrupa por mes; si no, por día.
    const usarMeses = hasta.getTime() - desde.getTime() > 62 * 86400000;
    const buckets = new Map<string, number>();
    for (const inc of incidentes) {
      const d = inc.abierto_el;
      const key = usarMeses
        ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
        : d.toISOString().slice(0, 10);
      buckets.set(key, (buckets.get(key) ?? 0) + 1);
    }
    const frecuencia = [...buckets.entries()]
      .sort((a, b) => (a[0] < b[0] ? -1 : 1))
      .map(([periodo, cantidad]) => ({ periodo, total: cantidad }));

    const agrupar = (campo: 'tipo' | 'severidad') => {
      const m = new Map<string, number>();
      for (const inc of incidentes) {
        const clave = inc[campo] || 'S/D';
        m.set(clave, (m.get(clave) ?? 0) + 1);
      }
      return [...m.entries()]
        .sort((a, b) => b[1] - a[1])
        .map(([clave, cantidad]) => ({
          clave,
          total: cantidad,
          porcentaje: total ? Math.round((cantidad / total) * 100) : 0,
        }));
    };

    return {
      rango: {
        desde: desde.toISOString().slice(0, 10),
        hasta: hasta.toISOString().slice(0, 10),
      },
      granularidad: usarMeses ? 'MES' : 'DIA',
      kpis: {
        total,
        resueltos,
        tasaResolucion: total ? Math.round((resueltos / total) * 100) : 0,
        tiempoMedioRespuestaMin,
        tiempoMedioResolucionMin,
      },
      frecuencia,
      porTipo: agrupar('tipo'),
      porSeveridad: agrupar('severidad'),
    };
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
