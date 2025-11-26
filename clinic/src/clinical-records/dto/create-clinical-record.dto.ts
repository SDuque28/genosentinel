import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsString,
  MaxLength,
  IsOptional,
  Min,
} from 'class-validator';

export class CreateClinicalRecordDto {
  @ApiProperty({
    description: 'ID del paciente',
    example: 1,
    minimum: 1,
  })
  @IsInt({ message: 'El ID del paciente debe ser un número entero' })
  @Min(1, { message: 'El ID del paciente debe ser mayor a 0' })
  patientId: number;

  @ApiProperty({
    description: 'ID del tipo de tumor',
    example: 3,
    minimum: 1,
  })
  @IsInt({ message: 'El ID del tipo de tumor debe ser un número entero' })
  @Min(1, { message: 'El ID del tipo de tumor debe ser mayor a 0' })
  tumorTypeId: number;

  @ApiProperty({
    description: 'Fecha del diagnóstico (formato ISO 8601)',
    example: '2023-12-10',
    type: String,
  })
  @IsDateString(
    {},
    { message: 'La fecha debe estar en formato válido (YYYY-MM-DD)' },
  )
  diagnosisDate: string;

  @ApiProperty({
    description: 'Diagnóstico médico',
    example: 'Carcinoma ductal infiltrante',
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty({ message: 'El diagnóstico es obligatorio' })
  @MaxLength(255, { message: 'El diagnóstico no puede exceder 255 caracteres' })
  diagnosis: string;

  @ApiProperty({
    description: 'Estadio del cáncer según clasificación TNM',
    example: 'IIB',
    maxLength: 20,
  })
  @IsString()
  @IsNotEmpty({ message: 'El estadio es obligatorio' })
  @MaxLength(20, { message: 'El estadio no puede exceder 20 caracteres' })
  stage: string;

  @ApiProperty({
    description: 'Protocolo de tratamiento aplicado',
    example:
      'Quimioterapia AC-T (4 ciclos Adriamicina + Ciclofosfamida, 4 ciclos Taxol) + Radioterapia',
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty({ message: 'El protocolo de tratamiento es obligatorio' })
  @MaxLength(255, {
    message: 'El protocolo de tratamiento no puede exceder 255 caracteres',
  })
  treatmentProtocol: string;

  @ApiProperty({
    description: 'Notas sobre la evolución del paciente',
    example:
      'Paciente tolera bien el tratamiento. Sin efectos adversos graves.',
    required: false,
  })
  @IsOptional()
  @IsString()
  evolutionNotes?: string;
}
