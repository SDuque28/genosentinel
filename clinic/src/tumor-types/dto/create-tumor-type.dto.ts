/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import {IsNotEmpty, IsOptional, IsString, MaxLength, MinLength,} from 'class-validator';

export class CreateTumorTypeDto {
  @ApiProperty({
    description: 'Nombre del tipo de tumor',
    example: 'Cáncer de mama',
    maxLength: 150,
    minLength: 3,
  })
  @IsString()
  @IsNotEmpty({ message: 'El nombre del tipo de tumor es obligatorio' })
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
  @MaxLength(150, { message: 'El nombre no puede exceder 150 caracteres' })
  name: string;

  @ApiProperty({
    description: 'Sistema o área del cuerpo afectada',
    example: 'Glándulas mamarias',
    maxLength: 150,
  })
  @IsString()
  @IsNotEmpty({ message: 'El sistema afectado es obligatorio' })
  @MaxLength(150, {
    message: 'El sistema afectado no puede exceder 150 caracteres',
  })
  systemAffected: string;

  @ApiProperty({
    description: 'Descripción adicional sobre el tipo de tumor',
    example: 'Tumor maligno que se desarrolla en el tejido mamario',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000, {
    message: 'La descripción no puede exceder 1000 caracteres',
  })
  description?: string;
}
