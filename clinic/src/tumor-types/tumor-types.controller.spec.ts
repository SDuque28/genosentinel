import { Test, TestingModule } from '@nestjs/testing';
import { TumorTypesController } from './tumor-types.controller';
import { TumorTypesService } from './tumor-types.service';
import { CreateTumorTypeDto } from './dto/create-tumor-type.dto';
import { UpdateTumorTypeDto } from './dto/update-tumor-type.dto';
import { NotFoundException } from '@nestjs/common';

describe('TumorTypesController', () => {
  let controller: TumorTypesController;

  const mockTumorType = {
    id: 1,
    name: 'Cáncer de mama',
    systemAffected: 'Glándulas mamarias',
    description: 'Descripción de prueba',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockTumorTypesService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TumorTypesController],
      providers: [
        {
          provide: TumorTypesService,
          useValue: mockTumorTypesService,
        },
      ],
    }).compile();

    controller = module.get<TumorTypesController>(TumorTypesController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a tumor type', async () => {
      const dto: CreateTumorTypeDto = {
        name: 'Cáncer de mama',
        systemAffected: 'Glándulas mamarias',
      };

      mockTumorTypesService.create.mockResolvedValue(mockTumorType);

      const result = await controller.create(dto);

      expect(result).toEqual(mockTumorType);
      expect(mockTumorTypesService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return an array of tumor types', async () => {
      const tumorTypes = [mockTumorType];
      mockTumorTypesService.findAll.mockResolvedValue(tumorTypes);

      const result = await controller.findAll();

      expect(result).toEqual(tumorTypes);
      expect(mockTumorTypesService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a tumor type by id', async () => {
      mockTumorTypesService.findOne.mockResolvedValue(mockTumorType);

      const result = await controller.findOne(1);

      expect(result).toEqual(mockTumorType);
      expect(mockTumorTypesService.findOne).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when tumor type not found', async () => {
      mockTumorTypesService.findOne.mockRejectedValue(
        new NotFoundException('Tipo de tumor con id 999 no encontrado'),
      );

      await expect(controller.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a tumor type', async () => {
      const dto: UpdateTumorTypeDto = {
        name: 'Cáncer de mama actualizado',
      };

      const updatedTumorType = { ...mockTumorType, ...dto };
      mockTumorTypesService.update.mockResolvedValue(updatedTumorType);

      const result = await controller.update(1, dto);

      expect(result).toEqual(updatedTumorType);
      expect(mockTumorTypesService.update).toHaveBeenCalledWith(1, dto);
    });
  });

  describe('remove', () => {
    it('should remove a tumor type', async () => {
      const response = {
        message: 'Tipo de tumor eliminado correctamente',
        id: 1,
      };
      mockTumorTypesService.remove.mockResolvedValue(response);

      const result = await controller.remove(1);

      expect(result).toEqual(response);
      expect(mockTumorTypesService.remove).toHaveBeenCalledWith(1);
    });
  });
});
