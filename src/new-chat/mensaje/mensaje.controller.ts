import {
  Controller,
  Post,
  Body,
  Request,
  Get,
  Param,
  UseGuards,
} from '@nestjs/common';
import { MensajeService } from './mensaje.service';
import { CreateMensajeDto } from './dto/create-mensaje.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { MensajeGateway } from './mensaje.gateway';

@Controller('mensajes')
export class MensajeController {
  constructor(
    private readonly mensajeService: MensajeService,
    private readonly mensajeGateway: MensajeGateway,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() createMensajeDto: CreateMensajeDto,
    @Request() req: any,
  ) {
    const usuario_id = req.user.usuario_id;

    console.log('Guardando mensaje en la base de datos...');
    const nuevoMensaje = await this.mensajeService.create(
      createMensajeDto,
      usuario_id,
    );

    console.log('Mensaje guardado. Emisión a través del WebSocket...');
    this.mensajeGateway.emitirNuevoMensaje(
      createMensajeDto.conversacion_id,
      nuevoMensaje,
    );

    return nuevoMensaje;
  }

  @Get(':conversacionId')
  async findAllByConversacion(@Param('conversacionId') conversacionId: string) {
    console.log('Obteniendo mensajes para la conversación:', conversacionId);
    return this.mensajeService.findAllByConversacion(conversacionId);
  }
}
