import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { MensajeService } from './mensaje.service';
import { CreateMensajeDto } from './dto/create-mensaje.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';


@Controller('mensaje')
export class MensajeController {
  constructor(private readonly mensajeService: MensajeService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  async create(@Body() createMensajeDto: CreateMensajeDto) {
    return this.mensajeService.createMensaje(createMensajeDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':chatId')
  async getMensajes(@Param('chatId') chatId: string) {
    return this.mensajeService.getMensajes(chatId);
  }
}
