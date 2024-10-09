import { Controller, Post, Body, UseGuards, Get, Request, UseInterceptors, UploadedFile } from '@nestjs/common';
import { MuroService } from './muro.service';
import { CreatePublicacionDto } from './dto/create-publicacion.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from 'src/multer.config';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('muro')
@Controller('admin/muro')
export class MuroController {
  constructor(private readonly muroService: MuroService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  @UseInterceptors(FileInterceptor('imagen', multerConfig())) 
  async create(@Body() createPublicacionDto: CreatePublicacionDto, @UploadedFile() file: Express.Multer.File, @Request() req) {
    const usuarioId: string = req.user.usuario_id;

    return this.muroService.createPublicacion(createPublicacionDto, usuarioId, file);
  }

  @UseGuards(JwtAuthGuard)
  @Get('publicaciones')
  async findAll() {
    return this.muroService.findAllPublicaciones();
  }
}
