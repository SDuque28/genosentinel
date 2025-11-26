import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { PatientsService } from './patients.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { PatientResponseDto } from './dto/patient-response.dto';

@ApiTags('patients')
@Controller('patients')
class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Crear un nuevo paciente',
    description:
      'Registra un nuevo paciente en el sistema con sus datos personales básicos',
  })
  @ApiBody({ type: CreatePatientDto })
  @ApiResponse({
    status: 201,
    description: 'Paciente creado exitosamente',
    type: PatientResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos o incompletos',
  })
  @ApiResponse({
    status: 409,
    description: 'Ya existe un paciente con ese nombre',
  })
  create(@Body() dto: CreatePatientDto): Promise<PatientResponseDto> {
    return this.patientsService.create(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar todos los pacientes',
    description:
      'Obtiene un listado completo de todos los pacientes registrados',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de pacientes obtenida exitosamente',
    type: [PatientResponseDto],
  })
  findAll(): Promise<PatientResponseDto[]> {
    return this.patientsService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener un paciente por ID',
    description: 'Recupera la información detallada de un paciente específico',
  })
  @ApiParam({
    name: 'id',
    description: 'ID único del paciente',
    type: Number,
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Paciente encontrado',
    type: PatientResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Paciente no encontrado',
  })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<PatientResponseDto> {
    return this.patientsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar datos de un paciente',
    description:
      'Modifica parcialmente la información de un paciente existente',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del paciente a actualizar',
    type: Number,
    example: 1,
  })
  @ApiBody({ type: UpdatePatientDto })
  @ApiResponse({
    status: 200,
    description: 'Paciente actualizado exitosamente',
    type: PatientResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Paciente no encontrado',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePatientDto,
  ): Promise<PatientResponseDto> {
    return this.patientsService.update(id, dto);
  }

  @Patch(':id/deactivate')
  @ApiOperation({
    summary: 'Desactivar un paciente',
    description:
      'Cambia el estado del paciente a "Desactivado" sin eliminarlo de la base de datos',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del paciente a desactivar',
    type: Number,
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Paciente desactivado exitosamente',
    type: PatientResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Paciente no encontrado',
  })
  deactivate(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<PatientResponseDto> {
    return this.patientsService.deactivate(id);
  }
}

export default PatientsController;
