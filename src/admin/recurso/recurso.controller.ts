import { Controller, Post, Body, Get, Param, Delete, Put, UseGuards, UseInterceptors, UploadedFile, Request } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
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
  @UseInterceptors(FileInterceptor('imagen', multerConfig())) 
  async createRecurso(
    @Body() createRecursoDto: CreateRecursoDto,
    @UploadedFile() file: Express.Multer.File,
    @Request() req: any
  ) {
    let imagenPath = '';

    if (file) {
      const uploadResult = await this.filesService.handleFileUpload(file, req);
      imagenPath = uploadResult.relativePath;
      createRecursoDto.imagen_url = imagenPath; // Guardar la ruta de la imagen en la base de datos
    }

    const newRecurso = await this.recursosService.createRecurso(createRecursoDto);
    return newRecurso;
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
