import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { parsearCsv, FilaCsv } from '../util/csv.util';
import { alfa, num, importe, fechaAmd } from '../util/ancho-fijo.util';

interface FilaNomina {
  cuil: string;
  apellido: string;
  nombre: string;
  fechaIngreso: Date | null;
}

export interface ResultadoImportacion {
  importados: number;
  omitidos: number;
  errores: string[];
}

@Injectable()
export class NominaService {
  constructor(private prisma: PrismaService) {}

  // ─── Importación desde CSV de Simplificación Registral ─────────────────────
  async importarNomina(
    tenantId: string,
    contenido: string,
  ): Promise<ResultadoImportacion> {
    const filas = parsearCsv(contenido);
    if (!filas.length) {
      throw new BadRequestException(
        'El archivo está vacío o no tiene un formato de CSV reconocible.',
      );
    }

    const parseadas: FilaNomina[] = [];
    const errores: string[] = [];
    filas.forEach((fila, i) => {
      const parsed = this.mapearFila(fila);
      if (!parsed) {
        errores.push(`Fila ${i + 2}: sin CUIL o nombre válidos, se omite.`);
        return;
      }
      parseadas.push(parsed);
    });

    // Evitamos duplicar: nadie con un CUIL ya cargado se vuelve a insertar.
    const cuils = parseadas.map((p) => p.cuil);
    const existentes = await this.prisma.vigilador.findMany({
      where: { tenant_id: tenantId, cuil: { in: cuils } },
      select: { cuil: true },
    });
    const yaCargados = new Set(existentes.map((e) => e.cuil));

    // Legajo autoincremental a partir del máximo numérico existente.
    let siguienteLegajo = await this.proximoLegajo(tenantId);

    let importados = 0;
    let omitidos = 0;
    for (const p of parseadas) {
      if (yaCargados.has(p.cuil)) {
        omitidos++;
        continue;
      }
      yaCargados.add(p.cuil);
      try {
        await this.prisma.vigilador.create({
          data: {
            tenant_id: tenantId,
            legajo_nro: String(siguienteLegajo++),
            nombre: p.nombre,
            apellido: p.apellido,
            documento: dniDeCuil(p.cuil),
            cuil: p.cuil,
            fecha_ingreso: p.fechaIngreso,
          },
        });
        importados++;
      } catch {
        omitidos++;
        errores.push(
          `${p.apellido}, ${p.nombre} (CUIL ${p.cuil}): no se pudo dar de alta.`,
        );
      }
    }

    return { importados, omitidos, errores };
  }

  private mapearFila(fila: FilaCsv): FilaNomina | null {
    const cuilRaw =
      fila['cuil'] ??
      fila['cuil_cuit'] ??
      fila['cuit'] ??
      fila['cuil_del_trabajador'] ??
      '';
    const cuil = cuilRaw.replace(/\D/g, '');
    if (cuil.length !== 11) return null;

    // La cabecera puede traer apellido y nombre juntos o separados.
    let apellido = fila['apellido'] ?? '';
    let nombre = fila['nombre'] ?? fila['nombres'] ?? '';
    const junto =
      fila['apellido_y_nombre'] ??
      fila['apellido_y_nombres'] ??
      fila['trabajador'] ??
      '';
    if ((!apellido || !nombre) && junto) {
      const partes = junto.split(',');
      if (partes.length >= 2) {
        apellido = apellido || partes[0].trim();
        nombre = nombre || partes.slice(1).join(',').trim();
      } else {
        const tokens = junto.trim().split(/\s+/);
        apellido = (apellido || tokens[0]) ?? '';
        nombre = nombre || tokens.slice(1).join(' ');
      }
    }
    if (!apellido && !nombre) return null;

    const fechaRaw =
      fila['fecha_ingreso'] ??
      fila['fecha_de_ingreso'] ??
      fila['fecha_alta'] ??
      '';
    return {
      cuil,
      apellido: apellido.trim() || '(sin apellido)',
      nombre: nombre.trim() || '(sin nombre)',
      fechaIngreso: parsearFecha(fechaRaw),
    };
  }

  private async proximoLegajo(tenantId: string): Promise<number> {
    const vigiladores = await this.prisma.vigilador.findMany({
      where: { tenant_id: tenantId },
      select: { legajo_nro: true },
    });
    const max = vigiladores.reduce((acc, v) => {
      const n = parseInt(v.legajo_nro, 10);
      return Number.isFinite(n) && n > acc ? n : acc;
    }, 0);
    return max + 1;
  }

  // ─── Exportación de altas (archivo plano de ancho fijo) ────────────────────
  /**
   * Genera el .txt de altas para ARCA. El layout de cada registro (posiciones y
   * longitudes) está centralizado en `armarRegistroAlta`: si ARCA publica un
   * cambio de disposición, se ajusta en un solo lugar.
   */
  async exportarAltasTxt(tenantId: string, ids: string[]): Promise<string> {
    if (!ids.length) {
      throw new BadRequestException(
        'No se seleccionó ningún legajo para exportar.',
      );
    }
    const vigiladores = await this.prisma.vigilador.findMany({
      where: { tenant_id: tenantId, id: { in: ids } },
    });
    if (!vigiladores.length) {
      throw new NotFoundException(
        'No se encontraron legajos del tenant para esos IDs.',
      );
    }
    const faltanCuil = vigiladores.filter(
      (v) => !v.cuil || v.cuil.length !== 11,
    );
    if (faltanCuil.length) {
      throw new BadRequestException(
        `Hay ${faltanCuil.length} legajo(s) sin CUIL válido; completalos antes de exportar.`,
      );
    }
    return (
      vigiladores.map((v) => this.armarRegistroAlta(v)).join('\r\n') + '\r\n'
    );
  }

  private armarRegistroAlta(v: {
    cuil: string | null;
    apellido: string;
    nombre: string;
    fecha_ingreso: Date | null;
  }): string {
    // Registro de alta temprana (ancho fijo). Campos: CUIL(11), Apellido(30),
    // Nombre(30), Fecha de alta AAAAMMDD(8), Marca de modalidad(1).
    return [
      num(v.cuil, 11),
      alfa(v.apellido, 30),
      alfa(v.nombre, 30),
      v.fecha_ingreso ? fechaAmd(v.fecha_ingreso) : num('', 8),
      alfa('A', 1), // A = Alta
    ].join('');
  }

  // ─── Exportación del Libro de Sueldos Digital (F01 + F02) ──────────────────
  /**
   * Genera el archivo del LSD para una liquidación: por cada empleado un registro
   * F01 (cabecera con totales del legajo) seguido de sus registros F02 (conceptos
   * liquidados). Los conceptos se derivan de las horas y montos del item según el
   * CCT UPSRA (507/07). Las longitudes de campo se centralizan en los helpers de
   * ancho fijo para poder ajustarlas si cambia la disposición oficial.
   */
  async exportarLsdTxt(
    tenantId: string,
    liquidacionId: string,
  ): Promise<string> {
    const liquidacion = await this.prisma.liquidacion.findFirst({
      where: { id: liquidacionId, tenant_id: tenantId },
      include: { items: { include: { vigilador: true } } },
    });
    if (!liquidacion) {
      throw new NotFoundException('Liquidación no encontrada.');
    }
    if (!liquidacion.items.length) {
      throw new BadRequestException(
        'La liquidación no tiene items para exportar.',
      );
    }

    const lineas: string[] = [];
    for (const item of liquidacion.items) {
      lineas.push(this.registroF01(item));
      lineas.push(...this.registrosF02(item));
    }
    return lineas.join('\r\n') + '\r\n';
  }

  private registroF01(item: any): string {
    // F01 — cabecera del legajo: tipo(2)="01", CUIL(11), legajo(10), categoría(20),
    // total remunerativo(15), total descuentos(15), neto(15).
    const v = item.vigilador;
    return [
      '01',
      num(v.cuil ?? v.documento, 11),
      alfa(v.legajo_nro, 10),
      alfa(v.categoria_laboral ?? 'VIGILADOR GENERAL', 20),
      importe(Number(item.bruto), 15),
      importe(Number(item.descuentos) + Number(item.adelanto_desc), 15),
      importe(Number(item.neto), 15),
    ].join('');
  }

  private registrosF02(item: any): string[] {
    const v = item.vigilador;
    const cuil = num(v.cuil ?? v.documento, 11);
    // Conceptos del CCT UPSRA 507/07. Código(6), descripción(30), cantidad(9, con
    // 2 decimales implícitos para horas), importe(15), tipo(1) R=remunerativo D=descuento.
    //
    // La liquidación de CustOS guarda TOTALES por legajo (bruto/descuentos/neto),
    // no el desglose peso-a-peso por adicional; por eso el remunerativo se emite
    // consolidado (importe = bruto, con las horas trabajadas como cantidad) y las
    // horas nocturnas/extra viajan como conceptos de cantidad informativa. Así el
    // archivo reconcilia: remunerativo − descuentos − adelanto = neto.
    const conceptos: {
      codigo: string;
      desc: string;
      cantidad: number;
      importe: number;
      tipo: 'R' | 'D';
    }[] = [
      {
        codigo: '100001',
        desc: 'SUELDO / HORAS NORMALES',
        cantidad: Number(item.hh_trabajadas),
        importe: Number(item.bruto),
        tipo: 'R',
      },
    ];
    if (Number(item.hh_nocturnas) > 0) {
      conceptos.push({
        codigo: '100010',
        desc: 'HS NOCTURNAS (INFORMATIVO)',
        cantidad: Number(item.hh_nocturnas),
        importe: 0,
        tipo: 'R',
      });
    }
    if (Number(item.hh_extra) > 0) {
      conceptos.push({
        codigo: '100020',
        desc: 'HS EXTRA (INFORMATIVO)',
        cantidad: Number(item.hh_extra),
        importe: 0,
        tipo: 'R',
      });
    }
    if (Number(item.descuentos) > 0) {
      conceptos.push({
        codigo: '900001',
        desc: 'DESCUENTOS DE LEY',
        cantidad: 0,
        importe: Number(item.descuentos),
        tipo: 'D',
      });
    }
    if (Number(item.adelanto_desc) > 0) {
      conceptos.push({
        codigo: '900010',
        desc: 'ADELANTO DE SUELDO',
        cantidad: 0,
        importe: Number(item.adelanto_desc),
        tipo: 'D',
      });
    }

    return conceptos.map((c) =>
      [
        '02',
        cuil,
        alfa(c.codigo, 6),
        alfa(c.desc, 30),
        importe(c.cantidad, 9),
        importe(c.importe, 15),
        alfa(c.tipo, 1),
      ].join(''),
    );
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
/** DNI a partir del CUIL: los 8 dígitos centrales (posiciones 3 a 10). */
function dniDeCuil(cuil: string): string {
  return cuil.slice(2, 10);
}

function parsearFecha(raw: string): Date | null {
  const s = (raw ?? '').trim();
  if (!s) return null;
  // dd/mm/aaaa o dd-mm-aaaa
  const dmy = s.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);
  if (dmy) {
    return new Date(Date.UTC(+dmy[3], +dmy[2] - 1, +dmy[1]));
  }
  // aaaa-mm-dd
  const ymd = s.match(/^(\d{4})[/-](\d{1,2})[/-](\d{1,2})$/);
  if (ymd) {
    return new Date(Date.UTC(+ymd[1], +ymd[2] - 1, +ymd[3]));
  }
  const t = Date.parse(s);
  return Number.isNaN(t) ? null : new Date(t);
}
