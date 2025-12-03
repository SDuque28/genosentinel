import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientsModule } from './patients/patients.module';
import { TumorTypesModule } from './tumor-types/tumor-types.module';
import { ClinicalRecordsModule } from './clinical-records/clinical-records.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'clinic_user',
      password: 'abcd1234',
      database: 'clinic_db',
      autoLoadEntities: true,
      synchronize: false,
    }),

    PatientsModule,

    TumorTypesModule,

    ClinicalRecordsModule,
  ],
})
export class AppModule {}
