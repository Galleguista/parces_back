import { Controller, Post, Body, Get, Param, Delete, UseGuards } from '@nestjs/common';
import { CreateRecursoDto } from './dto/create-recurso.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RecursosService } from './recurso.service';


@Controller('recursos')
export class RecursosController {
  constructor(private readonly recursosService: RecursosService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  async createRecurso(@Body() createRecursoDto: CreateRecursoDto) {
    return this.recursosService.createRecurso(createRecursoDto);
  }

  @Get()
  async getAllRecursos() {
    return this.recursosService.getAllRecursos();
  }

  @Get(':recursoId')
  async getRecursoById(@Param('recursoId') recursoId: string) {
    return this.recursosService.getRecursoById(recursoId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':recursoId')
  async deleteRecurso(@Param('recursoId') recursoId: string) {
    return this.recursosService.deleteRecurso(recursoId);
  }
}
