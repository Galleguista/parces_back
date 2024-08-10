import { Controller, Post, Body, UseGuards, Get, Request, UseInterceptors, UploadedFile } from '@nestjs/common';
import { MuroService } from './muro.service';
import { CreatePublicacionDto } from './dto/create-publicacion.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('muro')
@Controller('admin/muro')
export class MuroController {
  constructor(private readonly muroService: MuroService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  @UseInterceptors(FileInterceptor('imagen', {
    storage: memoryStorage(),
  }))
  async create(@Body() createPublicacionDto: CreatePublicacionDto, @UploadedFile() file: Express.Multer.File, @Request() req) {
    const usuarioId: string = req.user.usuario_id;
    if (file) {
      createPublicacionDto.imagen_url = file.buffer;
    }
    return this.muroService.createPublicacion(createPublicacionDto, usuarioId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('publicaciones')
  async findAll() {
    return this.muroService.findAllPublicaciones();
  }
}
