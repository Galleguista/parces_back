import { Controller, Post, Body, Get, Param, Delete, Put, UseGuards, UseInterceptors, UploadedFile, Request, UploadedFiles, Req } from '@nestjs/common';
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

  @Post('create')
@UseInterceptors(
  FileFieldsInterceptor([
    { name: 'imagen', maxCount: 1 },
    { name: 'pdf', maxCount: 1 },
  ], multerConfig())
)
async createRecurso(
  @UploadedFiles() files: { imagen?: Express.Multer.File[], pdf?: Express.Multer.File[] },
  @Body() createRecursoDto: CreateRecursoDto,
  @Req() req: any
) {
  const recurso = await this.recursosService.createRecurso(createRecursoDto, files, req);
  return recurso;
}

 
@Put(':recursoId')
@UseInterceptors(
  FileFieldsInterceptor([
    { name: 'imagen', maxCount: 1 },
    { name: 'pdf', maxCount: 1 },
  ], multerConfig())
)
async updateRecurso(
  @Param('recursoId') recursoId: string,
  @UploadedFiles() files: { imagen?: Express.Multer.File[], pdf?: Express.Multer.File[] },
  @Body() updateRecursoDto: UpdateRecursoDto,
  @Req() req: any
) {
  const recurso = await this.recursosService.updateRecurso(recursoId, updateRecursoDto, files, req);
  return recurso;
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
