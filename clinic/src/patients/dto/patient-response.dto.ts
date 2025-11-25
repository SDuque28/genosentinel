import { ApiProperty } from '@nestjs/swagger';
import { Gender, PatientStatus } from '../enums/patient.enum';

export class PatientResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Juan Carlos' })
  firstName: string;

  @ApiProperty({ example: 'Pérez García' })
  lastName: string;

  @ApiProperty({ example: '1985-06-15' })
  birthDate: string;

  @ApiProperty({ enum: Gender, example: Gender.MALE })
  gender: Gender;

  @ApiProperty({ enum: PatientStatus, example: PatientStatus.ACTIVE })
  status: PatientStatus;
}
