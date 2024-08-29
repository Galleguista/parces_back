import { Controller, Post, Body, Get, Param, Delete, UploadedFile, UseInterceptors, UseGuards } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateRecursoDto } from './dto/create-recurso.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { multerConfig } from 'src/multer.config';
import { RecursosService } from './recurso.service';

@Controller('recursos')
export class RecursosController {
  constructor(private readonly recursosService: RecursosService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  @UseInterceptors(FileInterceptor('pdf', multerConfig))
  async createRecurso(@UploadedFile() pdf: Express.Multer.File, @Body() createRecursoDto: CreateRecursoDto) {
    const pdf_url = pdf ? `uploads/recursos/${pdf.filename}` : null;
    if (!pdf_url) {
      throw new Error('PDF file is required');
    }
    return this.recursosService.createRecurso({ ...createRecursoDto, pdf_url });
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
