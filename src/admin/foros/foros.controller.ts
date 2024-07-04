import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { ForosService } from './foros.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';


@Controller('foros')
export class ForosController {
  constructor(private readonly forosService: ForosService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  async createForo(@Body() body: { nombre: string, descripcion: string }) {
    return this.forosService.createForo(body.nombre, body.descripcion);
  }

  @Get()
  async getAllForos() {
    return this.forosService.getAllForos();
  }

  @Get(':foroId')
  async getForoById(@Param('foroId') foroId: string) {
    return this.forosService.getForoById(foroId);
  }
}
