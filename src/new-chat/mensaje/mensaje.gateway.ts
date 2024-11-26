import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    WebSocketGateway,
    WebSocketServer,
  } from '@nestjs/websockets';
  import { Server, Socket } from 'socket.io';
  import { Injectable } from '@nestjs/common';
  
  @Injectable()
  @WebSocketGateway({ cors: true })
  export class MensajeGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;
  
    handleConnection(client: Socket) {
      console.log(`Cliente conectado: ${client.id}`);
      const { conversacionId } = client.handshake.query;
      if (conversacionId) {
        client.join(conversacionId); // Une al cliente a una sala específica
        console.log(`Cliente ${client.id} unido a la sala ${conversacionId}`);
      }
    }
  
    handleDisconnect(client: Socket) {
      console.log(`Cliente desconectado: ${client.id}`);
    }
  
    /**
     * Emitir un mensaje nuevo a los clientes conectados a una conversación.
     * @param conversacionId ID de la conversación.
     * @param mensaje Datos del mensaje creado.
     */
    emitNewMessage(conversacionId: string, mensaje: any) {
      this.server.to(conversacionId).emit('newMessage', mensaje);
    }
  }
  