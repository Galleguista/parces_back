import {
  Controller,
  Post,
  Body,
  Request,
  Get,
  Param,
  UseGuards,
  NotFoundException,
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

  @UseGuards(JwtAuthGuard)
  @Get(':conversacionId')
  async getMessages(@Param('conversacionId') conversacionId: string) {
    try {
      return await this.mensajeService.getMessagesByConversation(conversacionId);
    } catch (error) {
      throw new NotFoundException('No se encontraron mensajes para esta conversación.');
    }
  }
  
}
