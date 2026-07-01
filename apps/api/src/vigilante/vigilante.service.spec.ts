import { Test, TestingModule } from '@nestjs/testing';
import { VigilanteService } from './vigilante.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('VigilanteService', () => {
  let service: VigilanteService;
  let prisma: PrismaService;

  const mockPrisma = {
    vigilador: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VigilanteService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<VigilanteService>(VigilanteService);
    prisma = module.get<PrismaService>(PrismaService);
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return paginated vigilantes for tenant', async () => {
      const mockVigilantes = [
        { id: '1', nombre: 'Juan', apellido: 'Perez', tenant_id: 'tenant-1' },
        { id: '2', nombre: 'Maria', apellido: 'Gomez', tenant_id: 'tenant-1' },
      ];
      mockPrisma.vigilador.findMany.mockResolvedValue(mockVigilantes);
      mockPrisma.vigilador.count.mockResolvedValue(2);

      const result = await service.findAll('tenant-1');

      expect(result).toEqual({
        data: mockVigilantes,
        total: 2,
        page: 1,
        limit: 50,
      });
      expect(prisma.vigilador.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { tenant_id: 'tenant-1', deleted_at: null },
          include: { credenciales: true },
        }),
      );
    });

    it('should apply pagination params', async () => {
      mockPrisma.vigilador.findMany.mockResolvedValue([]);
      mockPrisma.vigilador.count.mockResolvedValue(0);

      await service.findAll('tenant-1', { page: 2, limit: 10, skip: 10 });

      expect(prisma.vigilador.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ skip: 10, take: 10 }),
      );
    });
  });

  describe('findOne', () => {
    it('should return vigilante when found and not deleted', async () => {
      const mockVigilante = {
        id: '1',
        nombre: 'Juan',
        tenant_id: 'tenant-1',
        deleted_at: null,
      };
      mockPrisma.vigilador.findFirst.mockResolvedValue(mockVigilante);

      const result = await service.findOne('1', 'tenant-1');

      expect(result).toEqual(mockVigilante);
      expect(prisma.vigilador.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: '1', tenant_id: 'tenant-1', deleted_at: null },
        }),
      );
    });

    it('should throw NotFoundException when not found', async () => {
      mockPrisma.vigilador.findFirst.mockResolvedValue(null);

      await expect(service.findOne('999', 'tenant-1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    it('should create and return new vigilante', async () => {
      const createData = {
        legajo_nro: 'V001',
        nombre: 'Carlos',
        apellido: 'Lopez',
        documento: '12345678',
        tenant_id: 'tenant-1',
      };
      const created = { id: '3', ...createData };
      mockPrisma.vigilador.create.mockResolvedValue(created);

      const result = await service.create(createData);

      expect(result).toEqual(created);
      expect(prisma.vigilador.create).toHaveBeenCalledWith({
        data: createData,
      });
    });
  });

  describe('update', () => {
    it('should update vigilante after verifying tenant', async () => {
      const existing = {
        id: '1',
        tenant_id: 'tenant-1',
        nombre: 'Juan',
        deleted_at: null,
      };
      mockPrisma.vigilador.findFirst.mockResolvedValue(existing);
      mockPrisma.vigilador.update.mockResolvedValue({
        ...existing,
        nombre: 'Juan Carlos',
      });

      const result = await service.update('1', 'tenant-1', {
        nombre: 'Juan Carlos',
      });

      expect(result?.nombre).toBe('Juan Carlos');
    });

    it('should throw NotFoundException when vigilante not in tenant', async () => {
      mockPrisma.vigilador.findFirst.mockResolvedValue(null);

      await expect(
        service.update('999', 'tenant-1', { nombre: 'Test' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should soft-delete vigilante by setting deleted_at', async () => {
      const existing = { id: '1', tenant_id: 'tenant-1', deleted_at: null };
      mockPrisma.vigilador.findFirst.mockResolvedValue(existing);
      mockPrisma.vigilador.update.mockResolvedValue({
        ...existing,
        deleted_at: new Date(),
      });

      await service.delete('1', 'tenant-1');

      expect(prisma.vigilador.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { deleted_at: expect.any(Date) },
      });
    });

    it('should throw NotFoundException when vigilante not found', async () => {
      mockPrisma.vigilador.findFirst.mockResolvedValue(null);

      await expect(service.delete('999', 'tenant-1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
