    import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

    export type Gender = 'M' | 'F';
    export type PatientStatus = 'Activo' | 'Seguimiento' | 'Desactivado';

    @Entity('patients')
    export class Patient {
    @PrimaryGeneratedColumn()
    id: number; // INT AUTO_INCREMENT

    @Column({ name: 'first_name', length: 100 })
    firstName: string;

    @Column({ name: 'last_name', length: 100 })
    lastName: string;

    @Column({ name: 'birth_date', type: 'date' })
    birthDate: string; // o Date si prefieres

    @Column({
        type: 'enum',
        enum: ['M', 'F'],
    })
    gender: Gender;

    @Column({
        type: 'enum',
        enum: ['Activo', 'Seguimiento', 'Desactivado'],
        default: 'Activo',
    })
    status: PatientStatus;
    }