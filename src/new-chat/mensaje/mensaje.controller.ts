import { Controller, Post, Body, Request, Get, Param, UnauthorizedException, UseGuards } from '@nestjs/common';
import { MensajeService } from './mensaje.service';
import { CreateMensajeDto } from './dto/create-mensaje.dto';
import { Request as ExpressRequest } from 'express'; // Importa el tipo correcto de Request
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('mensajes')
export class MensajeController {
  constructor(private readonly mensajeService: MensajeService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() createMensajeDto: CreateMensajeDto,
    @Request() req: any,
  ) {
    const usuario_id = req.user.usuario_id; // Esto debería ser accesible con la estrategia actual.
    if (!usuario_id) {
      throw new UnauthorizedException('Usuario no autenticado');
    }
    return this.mensajeService.create(createMensajeDto, usuario_id);
  }
  

  @Get(':conversacionId')
  findAllByConversacion(@Param('conversacionId') conversacionId: string) {
    return this.mensajeService.findAllByConversacion(conversacionId);
  }
}
