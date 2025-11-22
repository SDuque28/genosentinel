    import { Controller, Get, Post, Patch, Body, Param, ParseIntPipe } from '@nestjs/common';
    import { ApiTags, ApiOperation } from '@nestjs/swagger';
    import { PatientsService } from './patients.service';
    import { CreatePatientDto } from './dto/create-patient.dto';
    import { UpdatePatientDto } from './dto/update-patient.dto';

    @ApiTags('patients')
    @Controller('patients')
    export class PatientsController {
    constructor(private readonly patientsService: PatientsService) {}

    @Post()
    @ApiOperation({ summary: 'Crear un nuevo paciente' })
    create(@Body() dto: CreatePatientDto) {
        return this.patientsService.create(dto);
    }

    @Get()
    @ApiOperation({ summary: 'Listar todos los pacientes' })
    findAll() {
        return this.patientsService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obtener un paciente por id' })
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.patientsService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Actualizar datos de un paciente' })
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdatePatientDto,
    ) {
        return this.patientsService.update(id, dto);
    }

    @Patch(':id/deactivate')
    @ApiOperation({ summary: 'Desactivar un paciente (cambiar a Desactivado)' })
    deactivate(@Param('id', ParseIntPipe) id: number) {
        return this.patientsService.deactivate(id);
    }
    }
