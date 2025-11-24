import { Test, TestingModule } from '@nestjs/testing';
import { TumorTypesService } from './tumor-types.service';

describe('TumorTypesService', () => {
  let service: TumorTypesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TumorTypesService],
    }).compile();

    service = module.get<TumorTypesService>(TumorTypesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
