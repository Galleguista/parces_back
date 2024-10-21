import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    OnGatewayConnection,
    OnGatewayDisconnect,
    MessageBody,
    ConnectedSocket,
  } from '@nestjs/websockets';
  import { Server, Socket } from 'socket.io';
  import { JwtService } from '@nestjs/jwt';
  import { Injectable } from '@nestjs/common';
  
  @WebSocketGateway({
    cors: {
      origin: '*',
    },
  })
  @Injectable()
  export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;
  
    constructor(private readonly jwtService: JwtService) {}
  
    async handleConnection(client: Socket) {
      const token = client.handshake.headers.authorization?.split(' ')[1];  // Obtener el token JWT
  
      if (token) {
        try {
          const decoded = this.jwtService.verify(token);  // Decodificar el token
          client.data.user = decoded;  // Guardar los datos del usuario en la conexión
        } catch (error) {
          client.disconnect();  // Desconectar si el token no es válido
        }
      } else {
        client.disconnect();  // Desconectar si no hay token
      }
    }
  
    handleDisconnect(client: Socket) {
      console.log(`Cliente desconectado: ${client.id}`);
    }
  
    @SubscribeMessage('enviarMensaje')
    handleSendMessage(@MessageBody() payload: any, @ConnectedSocket() client: Socket) {
      const user = client.data.user;  // Acceder a los datos del usuario
      const message = {
        usuario_id: user.sub,  // El `sub` del token JWT suele ser el `user_id`
        contenido: payload.contenido,
        conversacion_id: payload.conversacion_id,
      };
  
      // Emitir el mensaje a todos los clientes en la conversación
      this.server.emit(`mensajes_${payload.conversacion_id}`, message);
    }
  }
  