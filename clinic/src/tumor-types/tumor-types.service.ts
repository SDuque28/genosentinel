/* eslint-disable @typescript-eslint/no-unsafe-member-access,prettier/prettier */
import {Injectable,NotFoundException,BadRequestException,ConflictException,} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TumorType } from './entities/tumor-type.entity';
import { CreateTumorTypeDto } from './dto/create-tumor-type.dto';
import { UpdateTumorTypeDto } from './dto/update-tumor-type.dto';
import { DeleteResponseDto } from './dto/delete-response.dto';

@Injectable()
export class TumorTypesService {
  constructor(
    @InjectRepository(TumorType)
    private readonly tumorTypeRepo: Repository<TumorType>,
  ) {}

  /**
   * Crea un nuevo tipo de tumor
   * @throws ConflictException si el nombre ya existe
   */
  async create(dto: CreateTumorTypeDto){
    // Verificar si ya existe un tipo de tumor con ese nombre
    const existing = await this.tumorTypeRepo.findOne({
      where: { name: dto.name },
    });

    if (existing) {
      throw new ConflictException(
        `Ya existe un tipo de tumor con el nombre "${dto.name}"`,
      );
    }

    try {
      const tumorType = this.tumorTypeRepo.create(dto);
      return await this.tumorTypeRepo.save(tumorType);
    } catch (error) {
      console.log('Error creating tumor type:', error);
      throw new BadRequestException('Error al crear el tipo de tumor');
    }
  }

  /**
   * Obtiene todos los tipos de tumor ordenados por nombre
   */
  async findAll(){
    return this.tumorTypeRepo.find({
      order: { name: 'ASC' },
    });
  }

  /**
   * Busca un tipo de tumor por ID
   * @throws NotFoundException si no existe
   */
  async findOne(id: number){
    const tumorType = await this.tumorTypeRepo.findOne({ where: { id } });

    if (!tumorType) {
      throw new NotFoundException(`Tipo de tumor con id ${id} no encontrado`);
    }

    return tumorType;
  }

  /**
   * Actualiza un tipo de tumor existente
   * @throws ConflictException si el nuevo nombre ya existe
   */
  async update(id: number, dto: UpdateTumorTypeDto){
    const tumorType = await this.findOne(id);

    // Si se está actualizando el nombre, verificar que no exista
    if (dto.name && dto.name !== tumorType.name) {
      const existing = await this.tumorTypeRepo.findOne({
        where: { name: dto.name },
      });

      if (existing) {
        throw new ConflictException(
          `Ya existe un tipo de tumor con el nombre "${dto.name}"`,
        );
      }
    }

    Object.assign(tumorType, dto);

    try {
      return await this.tumorTypeRepo.save(tumorType);
    } catch (error) {
      console.log('Error updating tumor type:', error);
      throw new BadRequestException('Error al actualizar el tipo de tumor');
    }
  }

  /**
   * Elimina permanentemente un tipo de tumor
   * @throws ConflictException si está siendo referenciado
   */
  async remove(id: number){
    const tumorType = await this.findOne(id);

    try {
      await this.tumorTypeRepo.remove(tumorType);
      return {
        message: 'Tipo de tumor eliminado correctamente',
        id,
      };
    } catch (error) {
      if (error.code === 'ER_ROW_IS_REFERENCED_2' || error.code === '23503') {
        throw new ConflictException(
          'No se puede eliminar este tipo de tumor porque está siendo referenciado por una o más historias clínicas',
        );
      }
      throw new BadRequestException('Error al eliminar el tipo de tumor');
    }
  }
}
