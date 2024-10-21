import { Controller, Post, Body, UseGuards, Get, UseInterceptors, UploadedFile, Request, Param, Res } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from 'src/multer.config';
import { MuroService } from './muro.service';
import { CreatePublicacionDto } from './dto/create-publicacion.dto';
import { FilesService } from 'src/system/files/files.service';
import { Response } from 'express';

@Controller('muro')
export class MuroController {
  constructor(
    private readonly muroService: MuroService,
    private readonly filesService: FilesService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  @UseInterceptors(FileInterceptor('imagen', multerConfig())) 
  async createPublicacion(
    @UploadedFile() file: Express.Multer.File, 
    @Body() createPublicacionDto: CreatePublicacionDto,
    @Request() req: any
  ) {
    try {
      let imagenUrl = '';

      if (file) {
        const uploadResult = await this.filesService.handleFileUpload(file, req);
        imagenUrl = uploadResult.relativePath; 
        createPublicacionDto.imagen_url = imagenUrl;
      }

      const newPublicacion = await this.muroService.createPublicacion(createPublicacionDto, req.user.usuario_id);
      return {
        success: true,
        message: 'Publicación creada correctamente.',
        newPublicacion,
      };
    } catch (error) {
      console.error('Error creando la publicación:', error);
      return {
        success: false,
        message: 'Error interno del servidor. Intente nuevamente.',
      };
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('publicaciones')
  async getAllPublicaciones() {
    const publicaciones = await this.muroService.findAllPublicaciones();
    return publicaciones.map(publicacion => {
      if (publicacion.imagen_url) {
        publicacion.imagen_url = this.filesService.getFileUrl(publicacion.imagen_url); // Obtener la URL pública
      }
      return publicacion;
    });
  }
}
