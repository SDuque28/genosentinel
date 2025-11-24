        import { Column, Entity, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';
        import { Patient } from '../../patients/entities/patient.entity';
        import { TumorType } from '../../tumor-types/entities/tumor-type.entity';

    @Entity('clinical_records')
    export class ClinicalRecord {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Patient)
    @JoinColumn({ name: 'patient_id' })
    patient: Patient;

    @ManyToOne(() => TumorType)
    @JoinColumn({ name: 'tumor_type_id' })
    tumorType: TumorType;

    @Column({ name: 'diagnosis_date', type: 'date' })
    diagnosisDate: string;

    @Column({ length: 255 })
    diagnosis: string; 

    @Column({ length: 20 })
    stage: string;

    @Column({ name: 'treatment_protocol', length: 255 })
    treatmentProtocol: string;

    @Column({ name: 'evolution_notes', type: 'text', nullable: true })
    evolutionNotes?: string; 
    }
