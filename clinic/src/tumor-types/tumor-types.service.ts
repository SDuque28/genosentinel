import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TumorType } from './entities/tumor-type.entity';
import { CreateTumorTypeDto } from './dto/create-tumor-type.dto';
import { UpdateTumorTypeDto } from './dto/update-tumor-type.dto';

@Injectable()
export class TumorTypesService {
  constructor(
    @InjectRepository(TumorType)
    private readonly tumorTypeRepo: Repository<TumorType>,
  ) {}

  create(dto: CreateTumorTypeDto) {
    const tumorType = this.tumorTypeRepo.create(dto);
    return this.tumorTypeRepo.save(tumorType);
  }

  findAll() {
    return this.tumorTypeRepo.find();
  }

  async findOne(id: number) {
    const tumorType = await this.tumorTypeRepo.findOne({ where: { id } });
    if (!tumorType) {
      throw new NotFoundException(`Tipo de tumor con id ${id} no encontrado`);
    }
    return tumorType;
  }

  async update(id: number, dto: UpdateTumorTypeDto) {
    const tumorType = await this.findOne(id);
    Object.assign(tumorType, dto);
    return this.tumorTypeRepo.save(tumorType);
  }

  async remove(id: number) {
    const tumorType = await this.findOne(id);
    await this.tumorTypeRepo.remove(tumorType);
    return { message: 'Tipo de tumor eliminado correctamente' };
  }
}
