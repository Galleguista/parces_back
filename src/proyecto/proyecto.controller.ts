import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { ProyectoService } from './proyecto.service';
import { CreateProyectoDto } from './dto/create-proyecto.dto';

@Controller('proyectos')
export class ProyectoController {
  constructor(private readonly proyectoService: ProyectoService) {}

  @Post('create')
  create(@Body() createProyectoDto: CreateProyectoDto) {
    return this.proyectoService.create(createProyectoDto);
  }

  @Get()
  findAll() {
    return this.proyectoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.proyectoService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProyectoDto: CreateProyectoDto) {
    return this.proyectoService.update(id, updateProyectoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.proyectoService.remove(id);
  }
}
