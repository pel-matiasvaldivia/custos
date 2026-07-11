import { LiquidacionesService } from './liquidaciones.service';

/**
 * Recargo por feriado trabajado: las horas de feriado siempre se computan e
 * informan, pero solo se PAGAN si el tenant activó `pagar_recargo_feriado`
 * en Configuración → Liquidación.
 */
describe('LiquidacionesService.computar (feriados)', () => {
  const VIG = {
    id: 'v1',
    legajo_nro: '1',
    nombre: 'JUAN',
    apellido: 'PEREZ',
    valor_hora: 1000,
    estado: 'ACTIVO',
  };
  // Turno diurno de 12 h (09→21 UTC: cae fuera de la ventana nocturna tanto
  // en UTC como en UTC-3, así el spec no depende del huso del runner) el 9 de
  // julio, feriado.
  const TURNO = {
    vigilador_id: 'v1',
    inicio_plan: new Date('2026-07-09T09:00:00Z'),
    fin_plan: new Date('2026-07-09T21:00:00Z'),
    inicio_real: new Date('2026-07-09T09:00:00Z'),
    fin_real: new Date('2026-07-09T21:00:00Z'),
    asistencia_estado: 'OK',
    estado: 'PLANIFICADA',
  };

  const armarService = (pagarRecargoFeriado: boolean) => {
    const prisma: any = {
      tenant: {
        findUnique: jest.fn().mockResolvedValue({ modo_liquidacion: 'VALOR_HORA_MANUAL' }),
      },
      reglaLaboral: {
        findUnique: jest.fn().mockResolvedValue({
          ventana_nocturna_inicio: '21:00',
          ventana_nocturna_fin: '06:00',
          recargo_nocturno_pct: 20,
          recargo_extra_pct: 50,
          recargo_feriado_pct: 100,
          pagar_recargo_feriado: pagarRecargoFeriado,
        }),
      },
      vigilador: { findMany: jest.fn().mockResolvedValue([VIG]) },
      turnoPlanificado: { findMany: jest.fn().mockResolvedValue([TURNO]) },
      adelanto: { findMany: jest.fn().mockResolvedValue([]) },
      feriado: {
        findMany: jest.fn().mockResolvedValue([{ fecha: new Date('2026-07-09T00:00:00Z') }]),
      },
      novedad: { findMany: jest.fn().mockResolvedValue([]) },
    };
    return new LiquidacionesService(prisma);
  };

  it('computa las horas de feriado y las paga con recargo si el toggle está activo', async () => {
    const service = armarService(true);
    const r = await service.computar('t1', '2026-07-01', '2026-07-31');
    expect(r.paga_feriado).toBe(true);
    const item = r.items[0];
    expect(item.hh_trabajadas).toBe(12);
    expect(item.hh_feriado).toBe(12);
    // 12 h × $1000 + recargo feriado 100% (12 h × $1000) = $24.000
    expect(item.bruto).toBe(24000);
  });

  it('con el toggle apagado informa las horas de feriado pero paga como día común', async () => {
    const service = armarService(false);
    const r = await service.computar('t1', '2026-07-01', '2026-07-31');
    expect(r.paga_feriado).toBe(false);
    const item = r.items[0];
    expect(item.hh_feriado).toBe(12); // se informa igual
    expect(item.bruto).toBe(12000); // pero no se paga el recargo
  });

  it('un turno en día común no suma horas de feriado', async () => {
    const service = armarService(true);
    (service as any).prisma.feriado.findMany.mockResolvedValue([]);
    const r = await service.computar('t1', '2026-07-01', '2026-07-31');
    expect(r.items[0].hh_feriado).toBe(0);
    expect(r.items[0].bruto).toBe(12000);
  });
});
