import { ApiProperty } from '@nestjs/swagger';

export class DeleteResponseDto {
  @ApiProperty({
    example: 'Tipo de tumor eliminado correctamente',
    description: 'Mensaje de confirmación',
  })
  message: string;

  @ApiProperty({
    example: 1,
    description: 'ID del registro eliminado',
  })
  id: number;
}
