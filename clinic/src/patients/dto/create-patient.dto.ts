    import { ApiProperty } from '@nestjs/swagger';
    import { IsDateString, IsEnum, IsNotEmpty, IsString } from 'class-validator';
    import type { Gender, PatientStatus } from '../entities/patient.entity';

    export class CreatePatientDto {
    @ApiProperty({ example: 'Juan' })
    @IsString()
    @IsNotEmpty()
    firstName: string;

    @ApiProperty({ example: 'Pérez' })
    @IsString()
    @IsNotEmpty()
    lastName: string;

    @ApiProperty({ example: '1985-06-15' })
    @IsDateString()
    birthDate: string;

    @ApiProperty({ enum: ['M', 'F'], example: 'M' })
    @IsEnum(['M', 'F'])
    gender: Gender;

    @ApiProperty({
        enum: ['Activo', 'Seguimiento', 'Desactivado'],
        example: 'Activo',
        required: false,
    })
    @IsEnum(['Activo', 'Seguimiento', 'Desactivado'])
    status?: PatientStatus;
    }
