import { Test, TestingModule } from '@nestjs/testing';
import { AuditoriaService } from './auditoria.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('AuditoriaService', () => {
  let service: AuditoriaService;
  const mockPrisma = { auditoria: { create: jest.fn() } };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuditoriaService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();
    service = module.get<AuditoriaService>(AuditoriaService);
    jest.clearAllMocks();
  });

  it('persiste el registro con los campos del spec', async () => {
    mockPrisma.auditoria.create.mockResolvedValue({});
    await service.registrar({
      tenantId: 't1',
      actorId: 'u1',
      entidad: 'ordenes_compra',
      entidadId: 'oc1',
      accion: 'CREAR',
      despues: { total: 1000 },
    });

    expect(mockPrisma.auditoria.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        tenant_id: 't1',
        actor_id: 'u1',
        entidad: 'ordenes_compra',
        entidad_id: 'oc1',
        accion: 'CREAR',
      }),
    });
  });

  it('NO propaga la excepción si falla la escritura (no rompe el negocio)', async () => {
    mockPrisma.auditoria.create.mockRejectedValue(new Error('db down'));
    await expect(
      service.registrar({
        tenantId: 't1',
        actorId: 'u1',
        entidad: 'cotizaciones',
        entidadId: 'c1',
        accion: 'EDITAR',
      }),
    ).resolves.toBeUndefined();
  });
});
