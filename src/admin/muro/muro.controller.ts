import { Controller, Post, Body, Get, Param, UseGuards, UseInterceptors, UploadedFile, Request } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { MuroService } from './muro.service';
import { CreatePublicacionDto } from './dto/create-publicacion.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from 'src/system/files/files.service';
import { multerConfig } from 'src/multer.config';

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
    @Body() createPublicacionDto: CreatePublicacionDto,
    @UploadedFile() imagen: Express.Multer.File,
    @Request() req: any
  ) {
    const usuarioId = req.user.usuario_id;
    return this.muroService.createPublicacion(createPublicacionDto, usuarioId, imagen);
  }

  @UseGuards(JwtAuthGuard)
  @Get('publicaciones')
  async findAllPublicaciones() {
    return this.muroService.findAllPublicaciones();
  }
}
