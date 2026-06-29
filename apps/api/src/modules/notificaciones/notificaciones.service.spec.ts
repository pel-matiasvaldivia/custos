import { Test, TestingModule } from '@nestjs/testing';
import { NotificacionesService } from './notificaciones.service';
import { PrismaAdminService } from '../../prisma/prisma-admin.service';

describe('NotificacionesService', () => {
  let service: NotificacionesService;
  const mockPrisma = {
    credencial: { findMany: jest.fn() },
    user: { findMany: jest.fn() },
    notificacion: { findFirst: jest.fn(), create: jest.fn() },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificacionesService,
        { provide: PrismaAdminService, useValue: mockPrisma },
      ],
    }).compile();
    service = module.get<NotificacionesService>(NotificacionesService);
    jest.clearAllMocks();
  });

  it('crea una notificación por credencial × destinatario ADMIN/RRHH', async () => {
    mockPrisma.credencial.findMany.mockResolvedValue([
      { id: 'cr1', tenant_id: 't1', tipo: 'CARNET_VIGILADOR', vence_el: new Date(), vigilador_id: 'v1' },
    ]);
    mockPrisma.user.findMany.mockResolvedValue([{ id: 'admin1' }, { id: 'rrhh1' }]);
    mockPrisma.notificacion.findFirst.mockResolvedValue(null);
    mockPrisma.notificacion.create.mockResolvedValue({});

    const creadas = await service.generarAvisosCredencialesPorVencer(30);

    expect(creadas).toBe(2);
    expect(mockPrisma.notificacion.create).toHaveBeenCalledTimes(2);
    expect(mockPrisma.notificacion.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        tipo: 'CREDENCIAL_POR_VENCER',
        canal: 'IN_APP',
      }),
    });
  });

  it('es idempotente: no duplica si ya existe notificación no leída', async () => {
    mockPrisma.credencial.findMany.mockResolvedValue([
      { id: 'cr1', tenant_id: 't1', tipo: 'PSICOFISICO', vence_el: new Date(), vigilador_id: 'v1' },
    ]);
    mockPrisma.user.findMany.mockResolvedValue([{ id: 'admin1' }]);
    mockPrisma.notificacion.findFirst.mockResolvedValue({ id: 'existente' });

    const creadas = await service.generarAvisosCredencialesPorVencer(30);

    expect(creadas).toBe(0);
    expect(mockPrisma.notificacion.create).not.toHaveBeenCalled();
  });

  it('no crea nada si no hay credenciales por vencer', async () => {
    mockPrisma.credencial.findMany.mockResolvedValue([]);
    const creadas = await service.generarAvisosCredencialesPorVencer(30);
    expect(creadas).toBe(0);
  });
});
