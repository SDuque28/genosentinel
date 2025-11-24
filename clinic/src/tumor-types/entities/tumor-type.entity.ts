    import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

    @Entity('tumor_types')
    export class TumorType {
    @PrimaryGeneratedColumn()
    id: number; // INT AUTO_INCREMENT

    @Column({ length: 150 })
    name: string;

    @Column({ name: 'system_affected', length: 150 })
    systemAffected: string;
    }
