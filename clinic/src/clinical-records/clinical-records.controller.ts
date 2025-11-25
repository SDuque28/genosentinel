import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ClinicalRecordsService } from './clinical-records.service';
import { CreateClinicalRecordDto } from './dto/create-clinical-record.dto';
import { UpdateClinicalRecordDto } from './dto/update-clinical-record.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('clinical-records')
@Controller('clinical-records')
export class ClinicalRecordsController {
  constructor(
    private readonly clinicalRecordsService: ClinicalRecordsService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear una historia clínica' })
  create(@Body() dto: CreateClinicalRecordDto) {
    return this.clinicalRecordsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas las historias clínicas' })
  findAll() {
    return this.clinicalRecordsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una historia clínica por id' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.clinicalRecordsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una historia clínica' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateClinicalRecordDto,
  ) {
    return this.clinicalRecordsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una historia clínica' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.clinicalRecordsService.remove(id);
  }
}
