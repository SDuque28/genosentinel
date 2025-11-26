import { Test, TestingModule } from '@nestjs/testing';
import { ClinicalRecordsController } from './clinical-records.controller';
import { ClinicalRecordsService } from './clinical-records.service';
import { CreateClinicalRecordDto } from './dto/create-clinical-record.dto';
import { UpdateClinicalRecordDto } from './dto/update-clinical-record.dto';
import { NotFoundException } from '@nestjs/common';

describe('ClinicalRecordsController', () => {
  let controller: ClinicalRecordsController;

  const mockPatient = {
    id: 1,
    firstName: 'Juan',
    lastName: 'Pérez',
    birthDate: '1985-06-15',
    gender: 'M',
    status: 'Activo',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockTumorType = {
    id: 3,
    name: 'Cáncer de mama',
    systemAffected: 'Glándulas mamarias',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockClinicalRecord = {
    id: 1,
    patient: mockPatient,
    tumorType: mockTumorType,
    diagnosisDate: '2023-12-10',
    diagnosis: 'Carcinoma ductal infiltrante',
    stage: 'IIB',
    treatmentProtocol: 'Quimioterapia AC-T',
    evolutionNotes: 'Paciente tolera bien el tratamiento',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockClinicalRecordsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClinicalRecordsController],
      providers: [
        {
          provide: ClinicalRecordsService,
          useValue: mockClinicalRecordsService,
        },
      ],
    }).compile();

    controller = module.get<ClinicalRecordsController>(
      ClinicalRecordsController,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a clinical record', async () => {
      const dto: CreateClinicalRecordDto = {
        patientId: 1,
        tumorTypeId: 3,
        diagnosisDate: '2023-12-10',
        diagnosis: 'Carcinoma ductal infiltrante',
        stage: 'IIB',
        treatmentProtocol: 'Quimioterapia AC-T',
      };

      mockClinicalRecordsService.create.mockResolvedValue(mockClinicalRecord);

      const result = await controller.create(dto);

      expect(result).toEqual(mockClinicalRecord);
      expect(mockClinicalRecordsService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return an array of clinical records', async () => {
      const records = [mockClinicalRecord];
      mockClinicalRecordsService.findAll.mockResolvedValue(records);

      const result = await controller.findAll();

      expect(result).toEqual(records);
      expect(mockClinicalRecordsService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a clinical record by id', async () => {
      mockClinicalRecordsService.findOne.mockResolvedValue(mockClinicalRecord);

      const result = await controller.findOne(1);

      expect(result).toEqual(mockClinicalRecord);
      expect(mockClinicalRecordsService.findOne).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when record not found', async () => {
      mockClinicalRecordsService.findOne.mockRejectedValue(
        new NotFoundException('Historia clínica con id 999 no encontrada'),
      );

      await expect(controller.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a clinical record', async () => {
      const dto: UpdateClinicalRecordDto = {
        stage: 'IIIA',
        evolutionNotes: 'Progresión favorable',
      };

      const updatedRecord = { ...mockClinicalRecord, ...dto };
      mockClinicalRecordsService.update.mockResolvedValue(updatedRecord);

      const result = await controller.update(1, dto);

      expect(result).toEqual(updatedRecord);
      expect(mockClinicalRecordsService.update).toHaveBeenCalledWith(1, dto);
    });
  });

  describe('remove', () => {
    it('should remove a clinical record', async () => {
      const response = {
        message: 'Historia clínica eliminada correctamente',
        id: 1,
      };
      mockClinicalRecordsService.remove.mockResolvedValue(response);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const result = await controller.remove(1);

      expect(result).toEqual(response);
      expect(mockClinicalRecordsService.remove).toHaveBeenCalledWith(1);
    });
  });
});
