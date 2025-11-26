import {
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
  Index,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Patient } from '../../patients/entities/patient.entity';
import { TumorType } from '../../tumor-types/entities/tumor-type.entity';

@Entity('clinical_records')
@Index(['patient'])
@Index(['diagnosisDate'])
export class ClinicalRecord {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ type: () => Patient })
  @ManyToOne(() => Patient, { eager: false })
  @JoinColumn({ name: 'patient_id' })
  patient: Patient;

  @ApiProperty({ type: () => TumorType })
  @ManyToOne(() => TumorType, { eager: false })
  @JoinColumn({ name: 'tumor_type_id' })
  tumorType: TumorType;

  @ApiProperty({ example: '2023-12-10' })
  @Column({ name: 'diagnosis_date', type: 'date' })
  diagnosisDate: string;

  @ApiProperty({ example: 'Carcinoma ductal infiltrante' })
  @Column({ length: 255 })
  diagnosis: string;

  @ApiProperty({ example: 'IIB' })
  @Column({ length: 20 })
  stage: string;

  @ApiProperty({ example: 'Quimioterapia AC-T + Radioterapia' })
  @Column({ name: 'treatment_protocol', length: 255 })
  treatmentProtocol: string;

  @ApiProperty({
    example: 'Paciente tolera bien el tratamiento',
    required: false,
  })
  @Column({ name: 'evolution_notes', type: 'text', nullable: true })
  evolutionNotes?: string;
}
