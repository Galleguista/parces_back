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

@WebSocketGateway({ cors: { origin: '*' } })
export class MensajeGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly mensajeService: MensajeService) {}

  async handleConnection(client: Socket) {
    console.log(`Intentando conectar cliente: ${client.id}`);
    const usuario_id = client.handshake.query.usuario_id as string;

    if (!usuario_id) {
      console.error(`Cliente sin usuario_id rechazado: ${client.id}`);
      client.disconnect();
      return;
    }

    client.data = { usuario_id };
    console.log(`Cliente conectado: ${client.id}, Usuario: ${usuario_id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Cliente desconectado: ${client.id}`);
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    client: Socket,
    @MessageBody() payload: { conversacion_id: string; contenido: any },
  ) {
    console.log('Payload recibido:', payload);

    const usuario_id = client.data?.usuario_id;
    if (!usuario_id) {
      console.error('Cliente no autenticado. No se encontró usuario_id.');
      client.emit('error', { message: 'No estás autenticado.' });
      return;
    }

    if (!payload.conversacion_id || !payload.contenido) {
      console.error('Payload inválido:', payload);
      client.emit('error', { message: 'Payload inválido.' });
      return;
    }

    try {
      console.log('Guardando mensaje...');
      const nuevoMensaje = await this.mensajeService.create(
        { conversacion_id: payload.conversacion_id, contenido: payload.contenido },
        usuario_id,
      );
      console.log('Mensaje guardado con éxito:', nuevoMensaje);

      this.emitirNuevoMensaje(payload.conversacion_id, nuevoMensaje);
    } catch (error) {
      console.error('Error al guardar el mensaje:', error.message);
      client.emit('error', { message: 'Error al guardar el mensaje.' });
    }
  }

  /**
   * Método para emitir un nuevo mensaje a una sala específica.
   * @param conversacion_id ID de la conversación.
   * @param mensaje Mensaje a emitir.
   */
  emitirNuevoMensaje(conversacion_id: string, mensaje: any) {
    console.log(`Emitiendo mensaje a la sala ${conversacion_id}:`, mensaje);
    this.server.to(conversacion_id).emit('newMessage', mensaje);
  }
}
