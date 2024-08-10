import { Controller, Post, Body, UseGuards, Get } from '@nestjs/common';
import { ProyectoService } from './proyecto.service';
import { CreateProyectoDto } from './dto/create-proyecto.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('proyectos')
@Controller('proyectos')
export class ProyectoController {
  constructor(private readonly proyectoService: ProyectoService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  async create(@Body() createProyectoDto: CreateProyectoDto) {
    return this.proyectoService.createProyecto(createProyectoDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll() {
    return this.proyectoService.getAllProyectos();
  }
}
