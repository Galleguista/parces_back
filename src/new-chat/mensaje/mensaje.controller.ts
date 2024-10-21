import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { MensajeService } from './mensaje.service';

@Controller('mensajes')
export class MensajeController {
  constructor(private readonly mensajeService: MensajeService) {}

  @Get(':conversacionId')
  obtenerMensajes(@Param('conversacionId') conversacionId: string) {
    return this.mensajeService.obtenerMensajesPorConversacion(conversacionId);
  }

  @Post()
  enviarMensaje(@Body('conversacion_id') conversacion_id: string, @Body('remitente_id') remitente_id: string, @Body('contenido') contenido: any) {
    return this.mensajeService.enviarMensaje(conversacion_id, remitente_id, contenido);
  }
}
