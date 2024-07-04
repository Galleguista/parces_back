import { Controller, Post, Body, Get, Param, Delete, Put, UseGuards } from '@nestjs/common';
import { LogrosService } from './logros.service';
import { CreateLogroDto } from './dto/create-logro.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';


@Controller('logros')
export class LogrosController {
  constructor(private readonly logrosService: LogrosService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  async createLogro(@Body() createLogroDto: CreateLogroDto) {
    return this.logrosService.createLogro(createLogroDto);
  }

  @Get()
  async getAllLogros() {
    return this.logrosService.getAllLogros();
  }

  @Get('usuario/:usuarioId')
  async getLogrosByUsuarioId(@Param('usuarioId') usuarioId: string) {
    return this.logrosService.getLogrosByUsuarioId(usuarioId);
  }

  @Get(':logroId')
  async getLogroById(@Param('logroId') logroId: string) {
    return this.logrosService.getLogroById(logroId);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':logroId')
  async updateLogro(@Param('logroId') logroId: string, @Body() updateLogroDto: CreateLogroDto) {
    return this.logrosService.updateLogro(logroId, updateLogroDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':logroId')
  async deleteLogro(@Param('logroId') logroId: string) {
    return this.logrosService.deleteLogro(logroId);
  }
}
