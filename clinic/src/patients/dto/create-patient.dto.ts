import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { Gender, PatientStatus } from '../enums/patient.enum';

export class CreatePatientDto {
  @ApiProperty({
    description: 'Nombre(s) del paciente',
    example: 'Juan Carlos',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @MaxLength(100, { message: 'El nombre no puede exceder 100 caracteres' })
  firstName: string;

  @ApiProperty({
    description: 'Apellido(s) del paciente',
    example: 'Pérez García',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty({ message: 'El apellido es obligatorio' })
  @MaxLength(100, { message: 'El apellido no puede exceder 100 caracteres' })
  lastName: string;

  @ApiProperty({
    description: 'Fecha de nacimiento del paciente (formato ISO 8601)',
    example: '1985-06-15',
    type: String,
  })
  @IsDateString(
    {},
    { message: 'La fecha debe estar en formato válido (YYYY-MM-DD)' },
  )
  birthDate: string;

  @ApiProperty({
    description: 'Género del paciente',
    enum: Gender,
    enumName: 'Gender',
    example: Gender.MALE,
  })
  @IsEnum(Gender, { message: 'El género debe ser M o F' })
  gender: Gender;

  @ApiProperty({
    description: 'Estado actual del paciente',
    enum: PatientStatus,
    enumName: 'PatientStatus',
    example: PatientStatus.ACTIVE,
    required: false,
    default: PatientStatus.ACTIVE,
  })
  @IsOptional()
  @IsEnum(PatientStatus, {
    message: 'El estado debe ser Activo, Seguimiento o Desactivado',
  })
  status?: PatientStatus;
}
