    import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Delete } from '@nestjs/common';
    import { ApiOperation, ApiTags } from '@nestjs/swagger';
    import { TumorTypesService } from './tumor-types.service';
    import { CreateTumorTypeDto } from './dto/create-tumor-type.dto';
    import { UpdateTumorTypeDto } from './dto/update-tumor-type.dto';

    @ApiTags('tumor-types')
    @Controller('tumor-types')
    export class TumorTypesController {
    constructor(private readonly tumorTypesService: TumorTypesService) {}

    @Post()
    @ApiOperation({ summary: 'Crear un nuevo tipo de tumor' })
    create(@Body() dto: CreateTumorTypeDto) {
        return this.tumorTypesService.create(dto);
    }

    @Get()
    @ApiOperation({ summary: 'Listar todos los tipos de tumor' })
    findAll() {
        return this.tumorTypesService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obtener un tipo de tumor por id' })
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.tumorTypesService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Actualizar un tipo de tumor' })
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateTumorTypeDto,
    ) {
        return this.tumorTypesService.update(id, dto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Eliminar un tipo de tumor' })
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.tumorTypesService.remove(id);
    }
    }
