import { Controller, Post, Body, Get, Param, Delete, Put, UseGuards, UseInterceptors, UploadedFile, Request, UploadedFiles } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { RecursosService } from './recurso.service';
import { CreateRecursoDto } from './dto/create-recurso.dto';
import { UpdateRecursoDto } from './dto/update-recurso.dto';
import { FilesService } from 'src/system/files/files.service';
import { multerConfig } from 'src/multer.config';

@Controller('recursos')
export class RecursosController {
  constructor(
    private readonly recursosService: RecursosService,
    private readonly filesService: FilesService
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'imagen', maxCount: 1 },
      { name: 'pdf', maxCount: 1 },
    ], multerConfig())
  )
  async createRecurso(
    @UploadedFiles() files: { imagen?: Express.Multer.File[], pdf?: Express.Multer.File[] },
    @Body() createRecursoDto: CreateRecursoDto
  ) {
    let imagen_url = '';
    let pdf_url = '';

    if (files.imagen && files.imagen[0]) {
      imagen_url = this.filesService.getFileUrl(files.imagen[0].path);
    }
    if (files.pdf && files.pdf[0]) {
      pdf_url = this.filesService.getFileUrl(files.pdf[0].path);
    }

    const recurso = await this.recursosService.createRecurso({
      ...createRecursoDto,
      imagen_url,
      pdf_url,
    });

    return recurso;
  }


  @UseGuards(JwtAuthGuard)
  @Put(':recursoId')
  @UseInterceptors(FileInterceptor('imagen', multerConfig())) 
  async updateRecurso(
    @Param('recursoId') recursoId: string,
    @Body() updateRecursoDto: UpdateRecursoDto,
    @UploadedFile() file: Express.Multer.File,
    @Request() req: any
  ) {
    let imagenPath = '';

    if (file) {
      const uploadResult = await this.filesService.handleFileUpload(file, req);
      imagenPath = uploadResult.relativePath;
      updateRecursoDto.imagen_url = imagenPath;
    }

    const updatedRecurso = await this.recursosService.updateRecurso(recursoId, updateRecursoDto);
    return updatedRecurso;
  }

  @UseGuards(JwtAuthGuard)
  @Get(':recursoId')
  async getRecursoById(@Param('recursoId') recursoId: string) {
    const recurso = await this.recursosService.getRecursoById(recursoId);

    if (recurso.imagen_url) {
      recurso.imagen_url = this.filesService.getFileUrl(recurso.imagen_url); // Convertir ruta de archivo
    }

    return recurso;
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllRecursos() {
    const recursos = await this.recursosService.getAllRecursos();

    return recursos.map(recurso => {
      if (recurso.imagen_url) {
        recurso.imagen_url = this.filesService.getFileUrl(recurso.imagen_url);
      }
      return recurso;
    });
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':recursoId')
  async deleteRecurso(@Param('recursoId') recursoId: string) {
    return this.recursosService.deleteRecurso(recursoId);
  }
}
