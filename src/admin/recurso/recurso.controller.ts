import { Controller, Post, Body, Get, Param, Delete, UploadedFile, UseInterceptors, UseGuards } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateRecursoDto } from './dto/create-recurso.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { multerConfig } from 'src/multer.config';
import { RecursosService } from './recurso.service';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('recursos')
export class RecursosController {
  constructor(private readonly recursosService: RecursosService) {}

  @Post('create')
  @UseInterceptors(FileInterceptor('pdf', {
    storage: diskStorage({
      destination: './uploads/pdf',
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = extname(file.originalname);
        callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
      },
    }),
  }))
  async createRecurso(@UploadedFile() pdf: Express.Multer.File, @Body() createRecursoDto: CreateRecursoDto) {
    console.log('PDF:', pdf);
    console.log('DTO:', createRecursoDto);
    const pdf_url = pdf ? `/uploads/pdf/${pdf.filename}` : null;
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
