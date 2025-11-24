import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClinicalRecordsService } from './clinical-records.service';
import { ClinicalRecordsController } from './clinical-records.controller';
import { ClinicalRecord } from './entities/clinical-record.entity';
import { Patient } from '../patients/entities/patient.entity';
import { TumorType } from '../tumor-types/entities/tumor-type.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ClinicalRecord, 
      Patient,
      TumorType,
    ]),
  ],
  controllers: [ClinicalRecordsController],
  providers: [ClinicalRecordsService],
})
export class ClinicalRecordsModule {}
