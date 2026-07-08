import { BadRequestException } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import { NominaService } from './nomina.service';

// CSV con la estructura real del export de "Consulta Nómina" de ARCA:
// preámbulo de 4 líneas y cabecera "CUIL,Apellido y Nombre,..." en la fila 5.
const CSV_ARCA = [
  'CUIT:,30-71728463-8,,,',
  'Período,05 2026,,,',
  'Secuencia:,0 - Original,,,',
  'Contribuyente:,SEV-AND SECURITY S. A. S.,,,',
  'CUIL,Apellido y Nombre,Obra Social,Situación,Remuneración Total',
  '20186078609,CLAUDIO WALTER MENDOZA,115300,1,"834975,75"',
  '27371376335,CELESTE ROCIO SEVILLA,121705,1,132421',
].join('\r\n');

describe('NominaService.importarNomina', () => {
  let service: NominaService;
  let prisma: {
    vigilador: {
      findMany: jest.Mock;
      create: jest.Mock;
    };
  };

  beforeEach(() => {
    prisma = {
      vigilador: {
        findMany: jest.fn().mockResolvedValue([]),
        create: jest.fn().mockResolvedValue({}),
      },
    };
    service = new NominaService(prisma as any);
  });

  it('importa el CSV real de ARCA salteando el preámbulo', async () => {
    const r = await service.importarNomina('tenant-1', Buffer.from(CSV_ARCA), 'Nomina.csv');
    expect(r.importados).toBe(2);
    expect(r.errores).toEqual([]);
    expect(prisma.vigilador.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          cuil: '20186078609',
          apellido: 'MENDOZA',
          nombre: 'CLAUDIO WALTER',
          documento: '18607860',
        }),
      }),
    );
    expect(prisma.vigilador.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          cuil: '27371376335',
          apellido: 'SEVILLA',
          nombre: 'CELESTE ROCIO',
        }),
      }),
    );
  });

  it('importa el XLSX real de ARCA (CUIL numérico y preámbulo)', async () => {
    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet('Nomina');
    // Como el export real: columna A vacía, preámbulo en la fila 1.
    ws.getRow(1).getCell(2).value =
      'CUIT:  30-71728463-8    Período  05 2026    Secuencia:  0 - Original';
    ws.getRow(2).values = [undefined, 'CUIL', 'Apellido y Nombre', 'Obra Social'];
    ws.getRow(3).values = [undefined, 20186078609, 'CLAUDIO WALTER MENDOZA', 115300];
    ws.getRow(4).values = [undefined, 27371376335, 'CELESTE ROCIO SEVILLA', 121705];
    const buffer = Buffer.from(await wb.xlsx.writeBuffer());

    const r = await service.importarNomina('tenant-1', buffer, 'Nomina.xlsx');
    expect(r.importados).toBe(2);
    expect(r.errores).toEqual([]);
    expect(prisma.vigilador.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          cuil: '20186078609',
          apellido: 'MENDOZA',
          nombre: 'CLAUDIO WALTER',
        }),
      }),
    );
  });

  it('omite CUIL ya cargados', async () => {
    prisma.vigilador.findMany
      .mockResolvedValueOnce([{ cuil: '20186078609' }]) // existentes
      .mockResolvedValueOnce([]); // legajos
    const r = await service.importarNomina('tenant-1', Buffer.from(CSV_ARCA), 'Nomina.csv');
    expect(r.importados).toBe(1);
    expect(r.omitidos).toBe(1);
  });

  it('reporta la fila original del archivo cuando una fila es inválida', async () => {
    const csv = CSV_ARCA + '\r\n123,SIN CUIL VALIDO,1,1,0';
    const r = await service.importarNomina('tenant-1', Buffer.from(csv), 'Nomina.csv');
    expect(r.importados).toBe(2);
    expect(r.errores).toEqual([
      'Fila 8: sin CUIL o nombre válidos, se omite.',
    ]);
  });

  it('rechaza .xls viejo (BIFF) con un mensaje claro', async () => {
    const biff = Buffer.from([0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1]);
    await expect(
      service.importarNomina('tenant-1', biff, 'Nomina.xls'),
    ).rejects.toThrow(BadRequestException);
  });

  it('rechaza un XLSX corrupto con BadRequest', async () => {
    const falso = Buffer.from('PKbasura-que-no-es-zip');
    await expect(
      service.importarNomina('tenant-1', falso, 'Nomina.xlsx'),
    ).rejects.toThrow(BadRequestException);
  });
});
