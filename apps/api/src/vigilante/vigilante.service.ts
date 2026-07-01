import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { PaginationDto } from '../common/dto/pagination.dto';
import * as bcrypt from 'bcrypt';
import * as ExcelJS from 'exceljs';

const CREDENCIALES_BASICAS = [
  'CARNET_VIGILADOR',
  'PSICOFISICO',
  'ANTECEDENTES',
];

@Injectable()
export class VigilanteService {
  constructor(private prisma: PrismaService) {}

  async findAll(tenantId: string, pagination?: PaginationDto) {
    const skip = pagination?.skip ?? 0;
    const take = pagination?.limit ?? 50;

    const [data, total] = await Promise.all([
      this.prisma.vigilador.findMany({
        where: { tenant_id: tenantId, deleted_at: null },
        include: { credenciales: true },
        skip,
        take,
        orderBy: { created_at: 'desc' },
      }),
      this.prisma.vigilador.count({
        where: { tenant_id: tenantId, deleted_at: null },
      }),
    ]);

    return { data, total, page: pagination?.page ?? 1, limit: take };
  }

  async findOne(id: string, tenantId: string) {
    const vigilador = await this.prisma.vigilador.findFirst({
      where: { id, tenant_id: tenantId, deleted_at: null },
      include: {
        credenciales: true,
      },
    });
    if (!vigilador) throw new NotFoundException('Vigilador no encontrado');
    return vigilador;
  }

  async create(data: Prisma.VigiladorUncheckedCreateInput) {
    return this.prisma.vigilador.create({
      data,
    });
  }

  async update(
    id: string,
    tenantId: string,
    data: Prisma.VigiladorUncheckedUpdateInput,
  ) {
    await this.findOne(id, tenantId);
    await this.prisma.vigilador.update({
      where: { id },
      data,
    });
    return this.recalcularCompletitud(id, tenantId);
  }

  async delete(id: string, tenantId: string) {
    await this.findOne(id, tenantId);
    return this.prisma.vigilador.update({
      where: { id },
      data: { deleted_at: new Date() },
    });
  }

  async setFoto(id: string, tenantId: string, fotoUrl: string) {
    await this.findOne(id, tenantId);
    await this.prisma.vigilador.update({
      where: { id },
      data: { foto_url: fotoUrl },
    });
    return this.recalcularCompletitud(id, tenantId);
  }

  async getCompletitud(id: string, tenantId: string) {
    const vigilador = await this.findOne(id, tenantId);
    return this.calcularChecklist(vigilador);
  }

  private calcularChecklist(vigilador: {
    foto_url: string | null;
    domicilio: string | null;
    telefono: string | null;
    credenciales: { tipo: string }[];
  }) {
    const tiposCargados = new Set(vigilador.credenciales.map((c) => c.tipo));
    const credencialesFaltantes = CREDENCIALES_BASICAS.filter(
      (tipo) => !tiposCargados.has(tipo),
    );

    const faltantes: string[] = [];
    if (!vigilador.foto_url) faltantes.push('foto');
    if (!vigilador.domicilio) faltantes.push('domicilio');
    if (!vigilador.telefono) faltantes.push('telefono');
    faltantes.push(
      ...credencialesFaltantes.map((tipo) => `credencial:${tipo}`),
    );

    return { completo: faltantes.length === 0, faltantes };
  }

  async recalcularCompletitud(id: string, tenantId: string) {
    const vigilador = await this.prisma.vigilador.findFirst({
      where: { id, tenant_id: tenantId },
      include: { credenciales: true },
    });
    if (!vigilador) return null;

    const { completo } = this.calcularChecklist(vigilador);
    return this.prisma.vigilador.update({
      where: { id },
      data: { completitud: completo ? 'COMPLETO' : 'INCOMPLETO' },
    });
  }

  async generarPlantilla(): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Vigiladores');

    sheet.columns = [
      { header: 'nombre *', key: 'nombre', width: 20 },
      { header: 'apellido *', key: 'apellido', width: 20 },
      { header: 'documento *', key: 'documento', width: 16 },
      { header: 'celular *', key: 'telefono', width: 18 },
      { header: 'domicilio *', key: 'domicilio', width: 32 },
      { header: 'contacto_emerg_nombre *', key: 'contacto_emerg_nombre', width: 26 },
      { header: 'contacto_emerg_celular *', key: 'contacto_emerg_telefono', width: 22 },
      { header: 'legajo', key: 'legajo_nro', width: 14 },
      { header: 'contacto_emerg_vinculo', key: 'contacto_emerg_vinculo', width: 22 },
    ];

    const headerRow = sheet.getRow(1);
    headerRow.eachCell((cell) => {
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E3A5F' } };
      cell.alignment = { vertical: 'middle' };
    });
    headerRow.height = 22;

    sheet.addRow({
      nombre: 'Juan',
      apellido: 'Pérez',
      documento: '12345678',
      telefono: '1123456789',
      domicilio: 'Av. Corrientes 1234, CABA',
      contacto_emerg_nombre: 'María Pérez',
      contacto_emerg_telefono: '1187654321',
      legajo_nro: 'VIG-001',
      contacto_emerg_vinculo: 'Esposa',
    });

    sheet.getRow(2).eachCell((cell) => {
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF0F4FF' } };
    });

    return workbook.xlsx.writeBuffer() as unknown as Promise<Buffer>;
  }

  async importarMasivo(
    tenantId: string,
    buffer: Buffer,
  ): Promise<{ creados: number; errores: { fila: number; mensaje: string }[] }> {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(buffer as unknown as ArrayBuffer);
    const sheet = workbook.worksheets[0];

    const errores: { fila: number; mensaje: string }[] = [];
    let creados = 0;

    const headerRow = sheet.getRow(1);
    const colIndex: Record<string, number> = {};
    headerRow.eachCell((cell, colNumber) => {
      const key = String(cell.value ?? '')
        .toLowerCase()
        .replace(/\s*\*/g, '')
        .trim();
      colIndex[key] = colNumber;
    });

    const col = {
      nombre: colIndex['nombre'],
      apellido: colIndex['apellido'],
      documento: colIndex['documento'],
      telefono: colIndex['celular'],
      domicilio: colIndex['domicilio'],
      contacto_emerg_nombre: colIndex['contacto_emerg_nombre'],
      contacto_emerg_telefono: colIndex['contacto_emerg_celular'],
      legajo_nro: colIndex['legajo'],
      contacto_emerg_vinculo: colIndex['contacto_emerg_vinculo'],
    };

    const getCell = (row: ExcelJS.Row, idx: number | undefined) =>
      idx ? String(row.getCell(idx).value ?? '').trim() : '';

    const dataRows: { row: ExcelJS.Row; rowNumber: number }[] = [];
    sheet.eachRow((row, rowNumber) => {
      if (rowNumber > 1) dataRows.push({ row, rowNumber });
    });

    for (const { row, rowNumber } of dataRows) {
      const nombre = getCell(row, col.nombre);
      const apellido = getCell(row, col.apellido);
      const documento = getCell(row, col.documento);
      const telefono = getCell(row, col.telefono);
      const domicilio = getCell(row, col.domicilio);
      const contacto_emerg_nombre = getCell(row, col.contacto_emerg_nombre);
      const contacto_emerg_telefono = getCell(row, col.contacto_emerg_telefono);
      let legajo_nro = getCell(row, col.legajo_nro);
      const contacto_emerg_vinculo = getCell(row, col.contacto_emerg_vinculo) || null;

      if (!nombre && !apellido && !documento) continue;

      const faltantes: string[] = [];
      if (!nombre) faltantes.push('nombre');
      if (!apellido) faltantes.push('apellido');
      if (!documento) faltantes.push('documento');
      if (!telefono) faltantes.push('celular');
      if (!domicilio) faltantes.push('domicilio');
      if (!contacto_emerg_nombre) faltantes.push('contacto_emerg_nombre');
      if (!contacto_emerg_telefono) faltantes.push('contacto_emerg_celular');

      if (faltantes.length > 0) {
        errores.push({
          fila: rowNumber,
          mensaje: `Campos obligatorios faltantes: ${faltantes.join(', ')}`,
        });
        continue;
      }

      if (!legajo_nro) {
        legajo_nro = `IMP-${Date.now()}-${rowNumber}`;
      }

      try {
        await this.prisma.vigilador.create({
          data: {
            tenant_id: tenantId,
            legajo_nro,
            nombre,
            apellido,
            documento,
            telefono,
            domicilio,
            contacto_emerg_nombre,
            contacto_emerg_telefono,
            contacto_emerg_vinculo,
          },
        });
        creados++;
      } catch (e: any) {
        if (e?.code === 'P2002') {
          errores.push({
            fila: rowNumber,
            mensaje: `El legajo "${legajo_nro}" ya existe para este tenant`,
          });
        } else {
          errores.push({
            fila: rowNumber,
            mensaje: `Error al guardar: ${e?.message ?? 'desconocido'}`,
          });
        }
      }
    }

    return { creados, errores };
  }

  /** Asigna o resetea el PIN de acceso a Vigilancia Móvil de un vigilador. */
  async setPin(id: string, tenantId: string, pin: string) {
    const vigilador = await this.prisma.vigilador.findFirst({
      where: { id, tenant_id: tenantId, deleted_at: null },
    });
    if (!vigilador) throw new NotFoundException('Vigilador no encontrado');

    const hash = await bcrypt.hash(pin, 10);
    await this.prisma.vigilador.update({
      where: { id },
      data: { pin: hash },
    });
    return { success: true };
  }
}
