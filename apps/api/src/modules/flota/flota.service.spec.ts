import { Test, TestingModule } from '@nestjs/testing';
import { FlotaService } from './flota.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('FlotaService', () => {
  let service: FlotaService;
  const mockPrisma = {
    vehiculo: { findFirst: jest.fn(), update: jest.fn(), findMany: jest.fn() },
    vehiculoVencimiento: { findMany: jest.fn() },
    cargaCombustible: { findFirst: jest.fn(), create: jest.fn(), findMany: jest.fn() },
    planMantenimiento: { findMany: jest.fn() },
    ordenTrabajo: { create: jest.fn(), findMany: jest.fn() },
    asignacionMovil: { findMany: jest.fn() },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FlotaService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();
    service = module.get<FlotaService>(FlotaService);
    jest.clearAllMocks();
  });

  describe('movilApto', () => {
    it('false si VTV vencida', async () => {
      mockPrisma.vehiculo.findFirst.mockResolvedValue({ estado: 'OPERATIVO' });
      mockPrisma.vehiculoVencimiento.findMany.mockResolvedValue([
        { tipo: 'VTV', vence_el: new Date('2020-01-01') },
      ]);
      expect(await service.movilApto('t1', 'v1')).toBe(false);
    });
    it('true si operativo y vigente', async () => {
      mockPrisma.vehiculo.findFirst.mockResolvedValue({ estado: 'OPERATIVO' });
      mockPrisma.vehiculoVencimiento.findMany.mockResolvedValue([
        { tipo: 'SEGURO', vence_el: new Date('2999-01-01') },
      ]);
      expect(await service.movilApto('t1', 'v1')).toBe(true);
    });
  });

  describe('registrarCarga', () => {
    it('calcula rendimiento contra la carga anterior y actualiza km', async () => {
      mockPrisma.cargaCombustible.findFirst.mockResolvedValue({ km: 10000 });
      mockPrisma.cargaCombustible.create.mockImplementation(({ data }: any) => data);
      mockPrisma.vehiculo.update.mockResolvedValue({});

      const carga: any = await service.registrarCarga('t1', 'v1', {
        fecha: '2026-06-01',
        litros: 50,
        importe: 60000,
        km: 10500,
      });

      expect(carga.rendimiento).toBe(10); // (10500-10000)/50
      expect(mockPrisma.vehiculo.update).toHaveBeenCalledWith({
        where: { id: 'v1' },
        data: { km_actual: 10500 },
      });
    });
  });

  describe('evaluarPlanesYGenerarOT', () => {
    it('genera OT preventiva cuando el plan por KM dispara', async () => {
      mockPrisma.vehiculo.findFirst.mockResolvedValue({ km_actual: 16000 });
      mockPrisma.planMantenimiento.findMany.mockResolvedValue([
        { disparo: 'KM', cada_km: 10000, ultimo_km: 5000 },
      ]);
      mockPrisma.ordenTrabajo.create.mockResolvedValue({ id: 'ot1' });

      const ots = await service.evaluarPlanesYGenerarOT('t1', 'v1');
      expect(ots).toEqual(['ot1']);
    });
  });
});
