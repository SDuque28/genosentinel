import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClinicalRecord } from './entities/clinical-record.entity';
import { CreateClinicalRecordDto } from './dto/create-clinical-record.dto';
import { UpdateClinicalRecordDto } from './dto/update-clinical-record.dto';
import { Patient } from '../patients/entities/patient.entity';
import { TumorType } from '../tumor-types/entities/tumor-type.entity';
import { DeleteClinicalRecordResponseDto } from './dto/delete-response.dto';

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

  /**
   * Crea una nueva historia clínica
   * @throws NotFoundException si el paciente o tipo de tumor no existe
   */
  async create(dto: CreateClinicalRecordDto): Promise<ClinicalRecord> {
    // Validar que existe el paciente
    const patient = await this.patientRepo.findOne({
      where: { id: dto.patientId },
    });
    if (!patient) {
      throw new NotFoundException(
        `Paciente con id ${dto.patientId} no encontrado`,
      );
    }

    // Validar que existe el tipo de tumor
    const tumorType = await this.tumorRepo.findOne({
      where: { id: dto.tumorTypeId },
    });
    if (!tumorType) {
      throw new NotFoundException(
        `Tipo de tumor con id ${dto.tumorTypeId} no encontrado`,
      );
    }

    try {
      const record = this.recordRepo.create({
        diagnosisDate: dto.diagnosisDate,
        diagnosis: dto.diagnosis,
        stage: dto.stage,
        treatmentProtocol: dto.treatmentProtocol,
        evolutionNotes: dto.evolutionNotes,
        patient,
        tumorType,
      });

      return await this.recordRepo.save(record);
    } catch (error) {
      console.log('Error creating clinical record:', error);
      throw new BadRequestException('Error al crear la historia clínica');
    }
  }

  /**
   * Obtiene todas las historias clínicas con sus relaciones
   */
  async findAll(): Promise<ClinicalRecord[]> {
    return this.recordRepo.find({
      relations: ['patient', 'tumorType'],
      order: { diagnosisDate: 'DESC' },
    });
  }

  /**
   * Busca una historia clínica por ID
   * @throws NotFoundException si no existe
   */
  async findOne(id: number): Promise<ClinicalRecord> {
    const record = await this.recordRepo.findOne({
      where: { id },
      relations: ['patient', 'tumorType'],
    });

    if (!record) {
      throw new NotFoundException(
        `Historia clínica con id ${id} no encontrada`,
      );
    }

    return record;
  }

  /**
   * Actualiza una historia clínica existente
   * @throws NotFoundException si la historia, paciente o tumor no existen
   */
  async update(
    id: number,
    dto: UpdateClinicalRecordDto,
  ): Promise<ClinicalRecord> {
    const record = await this.findOne(id);

    // Si se actualiza el paciente, validar que existe
    if (dto.patientId && dto.patientId !== record.patient.id) {
      const patient = await this.patientRepo.findOne({
        where: { id: dto.patientId },
      });
      if (!patient) {
        throw new NotFoundException(
          `Paciente con id ${dto.patientId} no encontrado`,
        );
      }
      record.patient = patient;
    }

    // Si se actualiza el tipo de tumor, validar que existe
    if (dto.tumorTypeId && dto.tumorTypeId !== record.tumorType.id) {
      const tumorType = await this.tumorRepo.findOne({
        where: { id: dto.tumorTypeId },
      });
      if (!tumorType) {
        throw new NotFoundException(
          `Tipo de tumor con id ${dto.tumorTypeId} no encontrado`,
        );
      }
      record.tumorType = tumorType;
    }

    // Actualizar los demás campos
    if (dto.diagnosisDate) record.diagnosisDate = dto.diagnosisDate;
    if (dto.diagnosis) record.diagnosis = dto.diagnosis;
    if (dto.stage) record.stage = dto.stage;
    if (dto.treatmentProtocol) record.treatmentProtocol = dto.treatmentProtocol;
    if (dto.evolutionNotes !== undefined)
      record.evolutionNotes = dto.evolutionNotes;

    try {
      return await this.recordRepo.save(record);
    } catch (error) {
      console.log('Error updating clinical record:', error);
      throw new BadRequestException('Error al actualizar la historia clínica');
    }
  }

  /**
   * Elimina permanentemente una historia clínica
   */
  async remove(id: number): Promise<DeleteClinicalRecordResponseDto> {
    const record = await this.findOne(id);

    try {
      await this.recordRepo.remove(record);
      return {
        message: 'Historia clínica eliminada correctamente',
        id,
      };
    } catch (error) {
      console.log('Error deleting clinical record:', error);
      throw new BadRequestException('Error al eliminar la historia clínica');
    }
  }
}
