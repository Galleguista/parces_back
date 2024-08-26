import { Controller, Get, Post, Body, Param, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ProyectoService } from './proyecto.service';
import { CreateProyectoDto } from './dto/create-proyecto.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';

@Controller('proyectos')
export class ProyectoController {
  constructor(private readonly proyectoService: ProyectoService) {}

  @Post('create')
  @UseInterceptors(FileInterceptor('imagen_representativa'))
  create(@Body() createProyectoDto: CreateProyectoDto, @UploadedFile() imagen_representativa: Express.Multer.File) {
    return this.proyectoService.create(createProyectoDto, imagen_representativa);
  }

  @Get()
  findAll() {
    return this.proyectoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.proyectoService.findOne(id);
  }
}
