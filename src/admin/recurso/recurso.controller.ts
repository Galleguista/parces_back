import { Controller, Post, Body, Get, Param, Delete, UseGuards, UploadedFile, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
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
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'imagen', maxCount: 1 },
        { name: 'pdf', maxCount: 1 },
      ],
      multerConfig(['image/jpeg', 'image/png', 'application/pdf'])
    )
  )
  async createRecurso(@UploadedFiles() files, @Body() createRecursoDto: CreateRecursoDto) {
    const imagen = files?.imagen?.[0];
    const pdf = files?.pdf?.[0];

    const imagen_url = imagen ? `/uploads/${imagen.filename}` : null;
    const pdf_url = pdf ? `/uploads/${pdf.filename}` : null;

    return this.recursosService.createRecurso({
      ...createRecursoDto,
      imagen_url,
      pdf_url,
    });
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
