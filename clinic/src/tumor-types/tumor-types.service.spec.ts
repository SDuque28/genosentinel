import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TumorTypesService } from './tumor-types.service';
import { TumorType } from './entities/tumor-type.entity';
import { NotFoundException, ConflictException } from '@nestjs/common';

describe('TumorTypesService', () => {
  let service: TumorTypesService;
  let repository: Repository<TumorType>;

  const mockTumorType = {
    id: 1,
    name: 'Cáncer de mama',
    systemAffected: 'Glándulas mamarias',
    description: 'Descripción',
  };

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    count: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TumorTypesService,
        {
          provide: getRepositoryToken(TumorType),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<TumorTypesService>(TumorTypesService);
    repository = module.get<Repository<TumorType>>(
      getRepositoryToken(TumorType),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a tumor type', async () => {
      const dto = {
        name: 'Cáncer de mama',
        systemAffected: 'Glándulas mamarias',
      };

      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockReturnValue(mockTumorType);
      mockRepository.save.mockResolvedValue(mockTumorType);

      const result = await service.create(dto);

      expect(result).toEqual(mockTumorType);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { name: dto.name },
      });
    });

    it('should throw ConflictException if name already exists', async () => {
      const dto = {
        name: 'Cáncer de mama',
        systemAffected: 'Glándulas mamarias',
      };

      mockRepository.findOne.mockResolvedValue(mockTumorType);

      await expect(service.create(dto)).rejects.toThrow(ConflictException);
    });
  });

  describe('findAll', () => {
    it('should return array of tumor types', async () => {
      const tumorTypes = [mockTumorType];
      mockRepository.find.mockResolvedValue(tumorTypes);

      const result = await service.findAll();

      expect(result).toEqual(tumorTypes);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(repository.find).toHaveBeenCalledWith({
        order: { name: 'ASC' },
      });
    });
  });

  describe('findOne', () => {
    it('should return a tumor type', async () => {
      mockRepository.findOne.mockResolvedValue(mockTumorType);

      const result = await service.findOne(1);

      expect(result).toEqual(mockTumorType);
    });

    it('should throw NotFoundException if not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a tumor type', async () => {
      const dto = { name: 'Nuevo nombre' };
      const updated = { ...mockTumorType, ...dto };

      mockRepository.findOne
        .mockResolvedValueOnce(mockTumorType) // findOne call
        .mockResolvedValueOnce(null); // name check
      mockRepository.save.mockResolvedValue(updated);

      const result = await service.update(1, dto);

      expect(result).toEqual(updated);
    });

    it('should throw ConflictException if new name exists', async () => {
      const dto = { name: 'Nombre existente' };
      const anotherTumorType = { ...mockTumorType, id: 2 };

      mockRepository.findOne
        .mockResolvedValueOnce(mockTumorType)
        .mockResolvedValueOnce(anotherTumorType);

      await expect(service.update(1, dto)).rejects.toThrow(ConflictException);
    });
  });

  describe('remove', () => {
    it('should remove a tumor type', async () => {
      mockRepository.findOne.mockResolvedValue(mockTumorType);
      mockRepository.remove.mockResolvedValue(mockTumorType);

      const result = await service.remove(1);

      expect(result).toEqual({
        message: 'Tipo de tumor eliminado correctamente',
        id: 1,
      });
    });

    it('should throw ConflictException on foreign key violation', async () => {
      mockRepository.findOne.mockResolvedValue(mockTumorType);
      mockRepository.remove.mockRejectedValue({
        code: 'ER_ROW_IS_REFERENCED_2',
      });

      await expect(service.remove(1)).rejects.toThrow(ConflictException);
    });
  });

  describe('exists', () => {
    it('should return true if tumor type exists', async () => {
      mockRepository.count.mockResolvedValue(1);

      const result = await service.exists(1);

      expect(result).toBe(true);
    });

    it('should return false if tumor type does not exist', async () => {
      mockRepository.count.mockResolvedValue(0);

      const result = await service.exists(999);

      expect(result).toBe(false);
    });
  });
});
