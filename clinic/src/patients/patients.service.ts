    import { Injectable, NotFoundException } from '@nestjs/common';
    import { InjectRepository } from '@nestjs/typeorm';
    import { Repository } from 'typeorm';
    import { Patient, PatientStatus } from './entities/patient.entity';
    import { CreatePatientDto } from './dto/create-patient.dto';
    import { UpdatePatientDto } from './dto/update-patient.dto';

    @Injectable()
    export class PatientsService {
    constructor(
        @InjectRepository(Patient)
        private readonly patientRepo: Repository<Patient>,
    ) {}

    async create(dto: CreatePatientDto) {
        const patient = this.patientRepo.create({
        ...dto,
        status: dto.status ?? 'Activo', // por si no lo mandan
        });
        return this.patientRepo.save(patient);
    }

    findAll() {
        return this.patientRepo.find();
    }

    async findOne(id: number) {
        const patient = await this.patientRepo.findOne({ where: { id } });
        if (!patient) {
        throw new NotFoundException(`Paciente con id ${id} no encontrado`);
        }
        return patient;
    }

    async update(id: number, dto: UpdatePatientDto) {
        const patient = await this.findOne(id);
        Object.assign(patient, dto);
        return this.patientRepo.save(patient);
    }

    async changeStatus(id: number, status: PatientStatus) {
        const patient = await this.findOne(id);
        patient.status = status;
        return this.patientRepo.save(patient);
    }

    async deactivate(id: number) {
        return this.changeStatus(id, 'Desactivado');
    }
    }
