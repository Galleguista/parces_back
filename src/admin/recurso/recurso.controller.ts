import { Controller, Post, Body, Get, Param, Delete, UseGuards, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateRecursoDto } from './dto/create-recurso.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RecursosService } from './recurso.service';

import { ApiTags } from '@nestjs/swagger';
import { multerConfig } from 'src/multer.config';

@ApiTags('recursos')
@Controller('recursos')
export class RecursosController {
  constructor(private readonly recursosService: RecursosService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  @UseInterceptors(FileInterceptor('file', multerConfig(['application/pdf', 'image/jpeg', 'image/png'])))
  async createRecurso(@UploadedFile() file: Express.Multer.File, @Body() createRecursoDto: CreateRecursoDto) {
    let imagen_url: string | null = null;
    let pdf_url: string | null = null;

    if (file.mimetype.includes('image')) {
      imagen_url = `/uploads/${file.path.split('/uploads/')[1]}`;
    } else if (file.mimetype.includes('pdf')) {
      pdf_url = `/uploads/${file.path.split('/uploads/')[1]}`;
    }

    return this.recursosService.createRecurso({ ...createRecursoDto, imagen_url, pdf_url });
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllRecursos() {
    return this.recursosService.getAllRecursos();
  }

  @UseGuards(JwtAuthGuard)
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
