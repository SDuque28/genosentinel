    import { Injectable, NotFoundException } from '@nestjs/common';
    import { InjectRepository } from '@nestjs/typeorm';
    import { Repository } from 'typeorm';
    import { ClinicalRecord } from './entities/clinical-record.entity';
    import { CreateClinicalRecordDto } from './dto/create-clinical-record.dto';
    import { UpdateClinicalRecordDto } from './dto/update-clinical-record.dto';
    import { Patient } from '../patients/entities/patient.entity';
    import { TumorType } from '../tumor-types/entities/tumor-type.entity';

    @Injectable()
    export class ClinicalRecordsService {
    constructor(
        @InjectRepository(ClinicalRecord)
        private readonly recordRepo: Repository<ClinicalRecord>,

        @InjectRepository(Patient)
        private readonly patientRepo: Repository<Patient>,

        @InjectRepository(TumorType)
        private readonly tumorRepo: Repository<TumorType>,
    ) {}

    async create(dto: CreateClinicalRecordDto) {
        const patient = await this.patientRepo.findOne({ where: { id: dto.patientId } });
        if (!patient) throw new NotFoundException('Paciente no encontrado');

        const tumorType = await this.tumorRepo.findOne({ where: { id: dto.tumorTypeId } });
        if (!tumorType) throw new NotFoundException('Tipo de tumor no encontrado');

        const record = this.recordRepo.create({
        diagnosisDate: dto.diagnosisDate,
        stage: dto.stage,
        treatmentProtocol: dto.treatmentProtocol,
        patient,
        tumorType,
        });

        return this.recordRepo.save(record);
    }

    findAll() {
        return this.recordRepo.find({
        relations: ['patient', 'tumorType'],
        });
    }

    async findOne(id: number) {
        const record = await this.recordRepo.findOne({
        where: { id },
        relations: ['patient', 'tumorType'],
        });

        if (!record) throw new NotFoundException(`Historia clínica con id ${id} no encontrada`);

        return record;
    }

    async update(id: number, dto: UpdateClinicalRecordDto) {
        const record = await this.findOne(id);

        if (dto.patientId) {
        const patient = await this.patientRepo.findOne({ where: { id: dto.patientId } });
        if (!patient) throw new NotFoundException('Paciente no encontrado');
        record.patient = patient;
        }

        if (dto.tumorTypeId) {
        const tumorType = await this.tumorRepo.findOne({ where: { id: dto.tumorTypeId } });
        if (!tumorType) throw new NotFoundException('Tipo de tumor no encontrado');
        record.tumorType = tumorType;
        }

        Object.assign(record, dto);

        return this.recordRepo.save(record);
    }

    async remove(id: number) {
        const record = await this.findOne(id);
        await this.recordRepo.remove(record);
        return { message: 'Historia clínica eliminada correctamente' };
    }
    }
        