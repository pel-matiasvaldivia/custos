import { Test, TestingModule } from '@nestjs/testing';
import { CuadranteService } from './cuadrante.service';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditoriaService } from '../auditoria/auditoria.service';
import { BadRequestException } from '@nestjs/common';

describe('CuadranteService.cerrarPeriodo', () => {
  let service: CuadranteService;
  const mockPrisma: any = {
    periodo: { findFirst: jest.fn(), update: jest.fn() },
    turnoPlanificado: { count: jest.fn(), findMany: jest.fn() },
    reglaLaboral: { findUnique: jest.fn() },
    feriado: { findMany: jest.fn() },
    contrato: { findMany: jest.fn() },
    contratoFacturacion: { findMany: jest.fn() },
    puesto: { findMany: jest.fn() },
    conciliacionHH: { create: jest.fn() },
  };
  const mockAuditoria = { registrar: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CuadranteService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: AuditoriaService, useValue: mockAuditoria },
      ],
    }).compile();
    service = module.get<CuadranteService>(CuadranteService);
    jest.clearAllMocks();

    mockPrisma.periodo.findFirst.mockResolvedValue({
      id: 'per-1',
      estado: 'ABIERTO',
      desde: new Date('2026-07-01'),
      hasta: new Date('2026-07-31'),
    });
    mockPrisma.reglaLaboral.findUnique.mockResolvedValue(null);
    mockPrisma.feriado.findMany.mockResolvedValue([]);
  });

  it('bloquea el cierre si hay turnos sin resolver', async () => {
    mockPrisma.turnoPlanificado.count.mockResolvedValue(3);
    await expect(service.cerrarPeriodo('t1', 'per-1')).rejects.toThrow(
      BadRequestException,
    );
    expect(mockPrisma.periodo.update).not.toHaveBeenCalled();
  });

  it('persiste ConciliacionHH por contrato y cierra el período', async () => {
    mockPrisma.turnoPlanificado.count.mockResolvedValue(0);
    mockPrisma.contrato.findMany.mockResolvedValue([
      { id: 'c1', objetivo_id: 'o1' },
    ]);
    mockPrisma.contratoFacturacion.findMany.mockResolvedValue([
      { contrato_id: 'c1', modo: 'POR_REAL', penaliza_hueco: false },
    ]);
    mockPrisma.puesto.findMany.mockResolvedValue([{ id: 'p1' }]);
    mockPrisma.turnoPlanificado.findMany.mockResolvedValue([
      {
        inicio_plan: new Date('2026-07-01T08:00'),
        fin_plan: new Date('2026-07-01T20:00'),
        inicio_real: new Date('2026-07-01T08:00'),
        fin_real: new Date('2026-07-01T20:00'),
        asistencia_estado: 'OK',
        vigilador_id: 'v1',
      },
    ]);
    mockPrisma.conciliacionHH.create.mockResolvedValue({ id: 'co1' });
    mockPrisma.periodo.update.mockResolvedValue({});

    const res = await service.cerrarPeriodo('t1', 'per-1', 'user-1');

    expect(res.conciliaciones).toBe(1);
    expect(mockPrisma.conciliacionHH.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        contrato_id: 'c1',
        periodo_id: 'per-1',
        congelada: true,
        hh_reales: 12,
        hh_facturables: 12, // POR_REAL
      }),
    });
    expect(mockPrisma.periodo.update).toHaveBeenCalledWith({
      where: { id: 'per-1' },
      data: { estado: 'CERRADO' },
    });
    // Auditoría de la acción sensible CERRAR.
    expect(mockAuditoria.registrar).toHaveBeenCalledWith(
      expect.objectContaining({
        entidad: 'periodos',
        entidadId: 'per-1',
        accion: 'CERRAR',
        actorId: 'user-1',
      }),
    );
  });

  it('rechaza cerrar un período ya CERRADO', async () => {
    mockPrisma.periodo.findFirst.mockResolvedValue({
      id: 'per-1',
      estado: 'CERRADO',
      desde: new Date('2026-07-01'),
      hasta: new Date('2026-07-31'),
    });
    await expect(service.cerrarPeriodo('t1', 'per-1')).rejects.toThrow(
      BadRequestException,
    );
  });
});

describe('CuadranteService.crearAsignacionEsquema (posición de ciclo automática)', () => {
  let service: CuadranteService;
  const mockPrisma: any = {
    puesto: { findFirst: jest.fn() },
    vigilador: { findFirst: jest.fn() },
    esquemaTurno: { findFirst: jest.fn() },
    asignacionEsquema: { findMany: jest.fn(), create: jest.fn() },
  };
  const mockAuditoria = { registrar: jest.fn() };

  // Ciclo 6 días: 2 mañanas, 2 tardes, 2 francos.
  const DEFINICION = {
    dias_ciclo: 6,
    dias: [
      { tipo: 'TRABAJO', bloques: [{ hora_inicio: '06:00', duracion_horas: 12 }] },
      { tipo: 'TRABAJO', bloques: [{ hora_inicio: '06:00', duracion_horas: 12 }] },
      { tipo: 'TRABAJO', bloques: [{ hora_inicio: '18:00', duracion_horas: 12 }] },
      { tipo: 'TRABAJO', bloques: [{ hora_inicio: '18:00', duracion_horas: 12 }] },
      { tipo: 'FRANCO' },
      { tipo: 'FRANCO' },
    ],
  };
  const ESQUEMA_DB = {
    id: 'esq-1',
    dias_ciclo: 6,
    definicion: DEFINICION,
  };

  const dto = {
    puesto_id: '11111111-1111-1111-1111-111111111111',
    vigilador_id: '22222222-2222-2222-2222-222222222222',
    esquema_id: 'esq-1',
    fecha_ancla: '2026-07-01',
    vigente_desde: '2026-07-01',
  } as any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CuadranteService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: AuditoriaService, useValue: mockAuditoria },
      ],
    }).compile();
    service = module.get<CuadranteService>(CuadranteService);
    jest.clearAllMocks();

    mockPrisma.puesto.findFirst.mockResolvedValue({ id: dto.puesto_id });
    mockPrisma.vigilador.findFirst.mockResolvedValue({
      id: dto.vigilador_id,
      estado: 'ACTIVO',
    });
    mockPrisma.esquemaTurno.findFirst.mockResolvedValue(ESQUEMA_DB);
    mockPrisma.asignacionEsquema.create.mockImplementation(
      async ({ data }: any) => ({ id: 'asig-nueva', ...data }),
    );
    // La generación de turnos se prueba aparte; acá interesa la posición.
    jest
      .spyOn(service, 'generarCuadrante')
      .mockResolvedValue({ generados: 0, creados: 0, rechazados: [] });
  });

  it('el primer vigilador del puesto arranca en posición 0', async () => {
    mockPrisma.asignacionEsquema.findMany.mockResolvedValue([]);
    await service.crearAsignacionEsquema('t1', dto);
    expect(mockPrisma.asignacionEsquema.create).toHaveBeenCalledWith({
      data: expect.objectContaining({ posicion_ciclo: 0 }),
    });
  });

  it('el segundo vigilador queda desfasado para no repetir horarios', async () => {
    mockPrisma.asignacionEsquema.findMany.mockResolvedValue([
      {
        posicion_ciclo: 0,
        fecha_ancla: new Date('2026-07-01'),
        esquema: ESQUEMA_DB,
      },
    ]);
    await service.crearAsignacionEsquema('t1', dto);
    expect(mockPrisma.asignacionEsquema.create).toHaveBeenCalledWith({
      data: expect.objectContaining({ posicion_ciclo: 2 }),
    });
  });

  it('respeta una posición de ciclo explícita', async () => {
    await service.crearAsignacionEsquema('t1', { ...dto, posicion_ciclo: 5 });
    expect(mockPrisma.asignacionEsquema.findMany).not.toHaveBeenCalled();
    expect(mockPrisma.asignacionEsquema.create).toHaveBeenCalledWith({
      data: expect.objectContaining({ posicion_ciclo: 5 }),
    });
  });
});
