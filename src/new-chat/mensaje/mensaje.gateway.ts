import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,

} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MensajeService } from './mensaje.service';
import { WsJwtAuthGuard } from 'src/auth/ws-jwt.guard';
import { UseGuards } from '@nestjs/common';


@WebSocketGateway({ cors: { origin: '*' } })
@UseGuards(WsJwtAuthGuard) 
export class MensajeGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly mensajeService: MensajeService) {}

  async handleConnection(client: Socket) {
    const usuario = client.data.usuario; // Datos del usuario autenticado

    console.log(`Cliente conectado: ${client.id}, Usuario: ${usuario.usuario_id}`);

    const { conversacionId } = client.handshake.query;

    if (conversacionId) {
      client.join(conversacionId as string);
      console.log(`Cliente ${client.id} unido a la sala ${conversacionId}`);
    } else {
      console.warn(`Cliente ${client.id} no proporcionó un conversacionId.`);
    }
  }

  handleDisconnect(client: Socket) {
    console.log(`Cliente desconectado: ${client.id}`);
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    client: Socket,
    @MessageBody() payload: { conversacion_id: string; contenido: any },
  ) {
    const usuario_id = client.data.usuario?.usuario_id;

    if (!usuario_id || !payload.conversacion_id || !payload.contenido) {
      console.error('Payload inválido:', payload);
      client.emit('error', { message: 'Payload inválido. Falta conversacion_id o contenido.' });
      return;
    }

    try {
      const nuevoMensaje = await this.mensajeService.create(
        { conversacion_id: payload.conversacion_id, contenido: payload.contenido },
        usuario_id,
      );

      console.log(`Mensaje guardado en la conversación ${payload.conversacion_id}`);

      this.server.to(payload.conversacion_id).emit('newMessage', nuevoMensaje);
    } catch (error) {
      console.error('Error al guardar el mensaje:', error.message);
      client.emit('error', { message: 'No se pudo enviar el mensaje.' });
    }
  }
}
