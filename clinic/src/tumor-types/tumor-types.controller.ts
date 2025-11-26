/* eslint-disable prettier/prettier */
import {Body,Controller,Get,Param,ParseIntPipe,Patch,Post,Delete,HttpCode,HttpStatus,} from '@nestjs/common';
import {ApiOperation, ApiTags, ApiResponse, ApiParam, ApiBody,} from '@nestjs/swagger';
import { TumorTypesService } from './tumor-types.service';
import { CreateTumorTypeDto } from './dto/create-tumor-type.dto';
import { UpdateTumorTypeDto } from './dto/update-tumor-type.dto';
import { TumorType } from './entities/tumor-type.entity';
import { DeleteResponseDto } from './dto/delete-response.dto';

@ApiTags('tumor-types')
@Controller('tumor-types')
export class TumorTypesController {
  constructor(private readonly tumorTypesService: TumorTypesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Crear un nuevo tipo de tumor',
    description: 'Registra un nuevo tipo de tumor en el catálogo del sistema',
  })
  @ApiBody({ type: CreateTumorTypeDto })
  @ApiResponse({
    status: 201,
    description: 'Tipo de tumor creado exitosamente',
    type: TumorType,
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos o el tipo de tumor ya existe',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflicto - El nombre del tipo de tumor ya está en uso',
  })
  create(@Body() dto: CreateTumorTypeDto): Promise<TumorType> {
    return this.tumorTypesService.create(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar todos los tipos de tumor',
    description:
      'Obtiene el catálogo completo de tipos de tumor registrados en el sistema',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de tipos de tumor obtenida exitosamente',
    type: [TumorType],
  })
  findAll(): Promise<TumorType[]> {
    return this.tumorTypesService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener un tipo de tumor por ID',
    description:
      'Recupera la información detallada de un tipo de tumor específico',
  })
  @ApiParam({
    name: 'id',
    description: 'ID único del tipo de tumor',
    type: Number,
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Tipo de tumor encontrado',
    type: TumorType,
  })
  @ApiResponse({
    status: 404,
    description: 'Tipo de tumor no encontrado',
  })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<TumorType> {
    return this.tumorTypesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar un tipo de tumor',
    description:
      'Modifica parcialmente la información de un tipo de tumor existente',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del tipo de tumor a actualizar',
    type: Number,
    example: 1,
  })
  @ApiBody({ type: UpdateTumorTypeDto })
  @ApiResponse({
    status: 200,
    description: 'Tipo de tumor actualizado exitosamente',
    type: TumorType,
  })
  @ApiResponse({
    status: 404,
    description: 'Tipo de tumor no encontrado',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflicto - El nuevo nombre ya está en uso',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTumorTypeDto,
  ): Promise<TumorType> {
    return this.tumorTypesService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Eliminar un tipo de tumor',
    description:
      'Elimina permanentemente un tipo de tumor del catálogo. ⚠️ Esta acción no se puede deshacer.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del tipo de tumor a eliminar',
    type: Number,
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Tipo de tumor eliminado exitosamente',
    type: DeleteResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Tipo de tumor no encontrado',
  })
  @ApiResponse({
    status: 409,
    description:
      'No se puede eliminar - El tipo de tumor está siendo referenciado por historias clínicas',
  })
  remove(@Param('id', ParseIntPipe) id: number): Promise<DeleteResponseDto> {
    return this.tumorTypesService.remove(id);
  }
}
