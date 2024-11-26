import { Controller, Post, Body, Request, Get, Param, UseGuards } from '@nestjs/common';
import { MensajeService } from './mensaje.service';
import { CreateMensajeDto } from './dto/create-mensaje.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('mensajes')
export class MensajeController {
  constructor(private readonly mensajeService: MensajeService) {}

  /**
   * Endpoint para crear un nuevo mensaje.
   * Requiere autenticación.
   */
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() createMensajeDto: CreateMensajeDto,
    @Request() req: any,
  ) {
    const usuario_id = req.user.usuario_id;
    return this.mensajeService.create(createMensajeDto, usuario_id);
  }

  /**
   * Endpoint para obtener todos los mensajes de una conversación.
   * @param conversacionId ID de la conversación.
   */
  @Get(':conversacionId')
  findAllByConversacion(@Param('conversacionId') conversacionId: string) {
    return this.mensajeService.findAllByConversacion(conversacionId);
  }
}
