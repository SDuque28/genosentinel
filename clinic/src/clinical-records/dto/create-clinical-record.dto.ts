    import { ApiProperty } from '@nestjs/swagger';
    import { IsDateString, IsInt, IsNotEmpty, IsString, MaxLength, IsOptional} from 'class-validator';

    export class CreateClinicalRecordDto {
    @ApiProperty({ example: 1 })
    @IsInt()
    patientId: number;

    @ApiProperty({ example: 3 })
    @IsInt()
    tumorTypeId: number;

    @ApiProperty({ example: '2023-12-10' })
    @IsDateString()
    diagnosisDate: string;

    @ApiProperty({ example: 'IIB' })
    @IsString()
    @MaxLength(20)
    stage: string;

    @IsString() //diagnostic
    @IsNotEmpty()
    @MaxLength(255)
    diagnosis: string; 

    @ApiProperty({ example: 'Quimioterapia, radioterapia' })
    @IsString()
    @MaxLength(255)
    treatmentProtocol: string;
    
    @IsString()
    @IsOptional()
    evolutionNotes?: string; 
    }
