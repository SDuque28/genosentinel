import {Body,Controller,Delete,Get,Param,ParseIntPipe,Patch,Post,HttpCode,HttpStatus,} from '@nestjs/common';
import {ApiOperation,ApiTags,ApiResponse,ApiParam,ApiBody,} from '@nestjs/swagger';
import { ClinicalRecordsService } from './clinical-records.service';
import { CreateClinicalRecordDto } from './dto/create-clinical-record.dto';
import { UpdateClinicalRecordDto } from './dto/update-clinical-record.dto';
import { ClinicalRecord } from './entities/clinical-record.entity';
import { DeleteClinicalRecordResponseDto } from './dto/delete-response.dto';

@ApiTags('clinical-records')
@Controller('clinical-records')
export class ClinicalRecordsController {
  constructor(
    private readonly clinicalRecordsService: ClinicalRecordsService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Crear una historia clínica',
    description:
      'Registra una nueva historia clínica asociada a un paciente y tipo de tumor',
  })
  @ApiBody({ type: CreateClinicalRecordDto })
  @ApiResponse({
    status: 201,
    description: 'Historia clínica creada exitosamente',
    type: ClinicalRecord,
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos',
  })
  @ApiResponse({
    status: 404,
    description: 'Paciente o tipo de tumor no encontrado',
  })
  create(@Body() dto: CreateClinicalRecordDto){
    return this.clinicalRecordsService.create(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar todas las historias clínicas',
    description:
      'Obtiene todas las historias clínicas con información de pacientes y tipos de tumor',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de historias clínicas obtenida exitosamente',
    type: [ClinicalRecord],
  })
  findAll(){
    return this.clinicalRecordsService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener una historia clínica por ID',
    description:
      'Recupera la información detallada de una historia clínica específica',
  })
  @ApiParam({
    name: 'id',
    description: 'ID único de la historia clínica',
    type: Number,
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Historia clínica encontrada',
    type: ClinicalRecord,
  })
  @ApiResponse({
    status: 404,
    description: 'Historia clínica no encontrada',
  })
  findOne(@Param('id', ParseIntPipe) id: number){
    return this.clinicalRecordsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar una historia clínica',
    description:
      'Modifica parcialmente la información de una historia clínica existente',
  })
  @ApiParam({
    name: 'id',
    description: 'ID de la historia clínica a actualizar',
    type: Number,
    example: 1,
  })
  @ApiBody({ type: UpdateClinicalRecordDto })
  @ApiResponse({
    status: 200,
    description: 'Historia clínica actualizada exitosamente',
    type: ClinicalRecord,
  })
  @ApiResponse({
    status: 404,
    description: 'Historia clínica, paciente o tipo de tumor no encontrado',
  })
  update(@Param('id', ParseIntPipe) id: number,@Body() dto: UpdateClinicalRecordDto,){
    return this.clinicalRecordsService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Eliminar una historia clínica',
    description:
      'Elimina permanentemente una historia clínica. ⚠️ Esta acción no se puede deshacer.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID de la historia clínica a eliminar',
    type: Number,
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Historia clínica eliminada exitosamente',
    type: DeleteClinicalRecordResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Historia clínica no encontrada',
  })
  remove(@Param('id', ParseIntPipe) id: number,){
    return this.clinicalRecordsService.remove(id);
  }
}
