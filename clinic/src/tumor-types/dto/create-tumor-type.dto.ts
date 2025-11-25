import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateTumorTypeDto {
  @ApiProperty({ example: 'Cáncer de mama' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  name: string;

  @ApiProperty({ example: 'Glándulas mamarias' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  systemAffected: string;
}
