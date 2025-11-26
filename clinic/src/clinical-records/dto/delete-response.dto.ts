import { ApiProperty } from '@nestjs/swagger';

export class DeleteClinicalRecordResponseDto {
  @ApiProperty({
    example: 'Historia clínica eliminada correctamente',
    description: 'Mensaje de confirmación de la eliminación',
  })
  message: string;

  @ApiProperty({
    example: 1,
    description: 'ID de la historia clínica eliminada',
  })
  id: number;
}
