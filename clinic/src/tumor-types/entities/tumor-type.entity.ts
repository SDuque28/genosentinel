import { Column, Entity, PrimaryGeneratedColumn, Index } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('tumor_types')
@Index(['name'])
export class TumorType {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'Cáncer de mama' })
  @Column({ length: 150, unique: true })
  name: string;

  @ApiProperty({ example: 'Glándulas mamarias' })
  @Column({ name: 'system_affected', length: 150 })
  systemAffected: string;

  @ApiProperty({
    example: 'Tumor maligno que se desarrolla en el tejido mamario',
    required: false,
  })
  @Column({
    type: 'text',
    nullable: true,
    comment: 'Descripción adicional del tipo de tumor',
  })
  description?: string;
}
