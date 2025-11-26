import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Patient } from './entities/patient.entity';
import { PatientStatus } from './enums/patient.enum';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';

@Injectable()
export class PatientsService {
  constructor(
    @InjectRepository(Patient)
    private readonly patientRepo: Repository<Patient>,
  ) {}

  /**
   * Crea un nuevo paciente
   */
  async create(dto: CreatePatientDto): Promise<Patient> {
    try {
      const patient = this.patientRepo.create({
        ...dto,
        status: dto.status ?? PatientStatus.ACTIVE,
      });
      if (
        await this.patientRepo.findOne({
          where: { firstName: dto.firstName },
        })
      ) {
        throw new ConflictException(
          `Ya existe un paciente con ese nombre y apellido"`,
        );
      }
      return await this.patientRepo.save(patient);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      console.log(`Error al crear el paciente: ${error}`);
      throw new BadRequestException('Error al crear el paciente');
    }
  }

  /**
   * Obtiene todos los pacientes
   */
  async findAll(): Promise<Patient[]> {
    return this.patientRepo.find({
      order: { id: 'ASC' },
    });
  }

  /**
   * Busca un paciente por ID
   */
  async findOne(id: number): Promise<Patient> {
    const patient = await this.patientRepo.findOne({ where: { id } });

    if (!patient) {
      throw new NotFoundException(`Paciente con id ${id} no encontrado`);
    }

    return patient;
  }

  /**
   * Actualiza un paciente existente
   */
  async update(id: number, dto: UpdatePatientDto): Promise<Patient> {
    const patient = await this.findOne(id);

    Object.assign(patient, dto);

    try {
      return await this.patientRepo.save(patient);
    } catch (error) {
      console.log(`Error al actualizar el paciente: ${error}`);
      throw new BadRequestException('Error al actualizar el paciente');
    }
  }

  /**
   * Cambia el estado de un paciente
   */
  async changeStatus(id: number, status: PatientStatus): Promise<Patient> {
    const patient = await this.findOne(id);
    patient.status = status;
    return this.patientRepo.save(patient);
  }

  /**
   * Desactiva un paciente (soft delete)
   */
  async deactivate(id: number): Promise<Patient> {
    return this.changeStatus(id, PatientStatus.DEACTIVATED);
  }
}
