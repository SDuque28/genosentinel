import { Test, TestingModule } from '@nestjs/testing';
import { ClinicalRecordsController } from './clinical-records.controller';

describe('ClinicalRecordsController', () => {
  let controller: ClinicalRecordsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClinicalRecordsController],
    }).compile();

    controller = module.get<ClinicalRecordsController>(ClinicalRecordsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
