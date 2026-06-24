import { Test, TestingModule } from '@nestjs/testing';
import { RentabilidadService } from './rentabilidad.service';
import { PrismaService } from '../../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('RentabilidadService', () => {
  let service: RentabilidadService;

  const mockPrisma = {
    tenant: { findUnique: jest.fn() },
    periodo: { findFirst: jest.fn() },
    configuracionCostos: { findUnique: jest.fn() },
    conciliacionHH: { findMany: jest.fn() },
    contrato: { findMany: jest.fn() },
    contratoFacturacion: { findMany: jest.fn() },
    ordenCompraItem: { findMany: jest.fn() },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RentabilidadService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<RentabilidadService>(RentabilidadService);
    jest.clearAllMocks();

    mockPrisma.tenant.findUnique.mockResolvedValue({ margen_objetivo: 0.25 });
    mockPrisma.periodo.findFirst.mockResolvedValue({ id: 'per-1' });
    mockPrisma.configuracionCostos.findUnique.mockResolvedValue({
      costo_hora_base: 1000,
    });
  });

  it('lanza NotFound si el período no existe', async () => {
    mockPrisma.periodo.findFirst.mockResolvedValue(null);
    await expect(
      service.rentabilidadPorContrato('tenant-1', 'per-x'),
    ).rejects.toThrow(NotFoundException);
  });

  it('devuelve [] si no hay conciliaciones en el período', async () => {
    mockPrisma.conciliacionHH.findMany.mockResolvedValue([]);
    const res = await service.rentabilidadPorContrato('tenant-1', 'per-1');
    expect(res).toEqual([]);
  });

  it('factura POR_REAL = hh_facturables × tarifa_hora y calcula margen', async () => {
    mockPrisma.conciliacionHH.findMany.mockResolvedValue([
      { contrato_id: 'c1', hh_facturables: 100, hh_reales: 90 },
    ]);
    mockPrisma.contrato.findMany.mockResolvedValue([
      { id: 'c1', codigo: 'CON-1', cliente_nombre: 'ACME' },
    ]);
    mockPrisma.contratoFacturacion.findMany.mockResolvedValue([
      { contrato_id: 'c1', modo: 'POR_REAL', tarifa_hora: 2000, abono_mensual: null },
    ]);
    mockPrisma.ordenCompraItem.findMany.mockResolvedValue([
      { contrato_id: 'c1', subtotal: 5000 },
    ]);

    const [r] = await service.rentabilidadPorContrato('tenant-1', 'per-1');

    // facturacion = 100 × 2000 = 200000
    expect(r.facturacion).toBe(200000);
    // costoLaboral = 90 × 1000 = 90000 ; compras = 5000 ; costoReal = 95000
    expect(r.costoReal).toBe(95000);
    // margen = 200000 - 95000 = 105000
    expect(r.margen).toBe(105000);
    expect(r.incompleto).toBe(true);
    expect(r.codigo).toBe('CON-1');
  });

  it('factura ABONO_FIJO = abono_mensual (ignora hh)', async () => {
    mockPrisma.conciliacionHH.findMany.mockResolvedValue([
      { contrato_id: 'c2', hh_facturables: 100, hh_reales: 100 },
    ]);
    mockPrisma.contrato.findMany.mockResolvedValue([
      { id: 'c2', codigo: 'CON-2', cliente_nombre: 'Beta' },
    ]);
    mockPrisma.contratoFacturacion.findMany.mockResolvedValue([
      { contrato_id: 'c2', modo: 'ABONO_FIJO', tarifa_hora: null, abono_mensual: 300000 },
    ]);
    mockPrisma.ordenCompraItem.findMany.mockResolvedValue([]);

    const [r] = await service.rentabilidadPorContrato('tenant-1', 'per-1');

    expect(r.facturacion).toBe(300000);
    // costoLaboral = 100 × 1000 = 100000, sin compras
    expect(r.margen).toBe(200000);
  });
});
