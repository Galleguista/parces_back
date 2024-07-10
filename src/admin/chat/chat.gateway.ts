import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';

import { MensajeService } from './mensaje/mensaje.service';
import { CreateMensajeDto } from './dto/create-mensage.dto';

@WebSocketGateway()
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(
    private readonly chatService: ChatService,
    private readonly mensajeService: MensajeService,
  ) {}

  afterInit(server: Server) {
    console.log('Init');
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  handleConnection(client: Socket, ...args: any[]) {
    console.log(`Client connected: ${client.id}`);
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(@MessageBody() createMensajeDto: CreateMensajeDto, @ConnectedSocket() client: Socket) {
    const usuarioId: string = client.handshake.query.usuario_id as string;
    createMensajeDto.usuario_id = usuarioId;
    const mensaje = await this.mensajeService.createMensaje(createMensajeDto);
    this.server.to(createMensajeDto.receptor_id).emit('receiveMessage', mensaje);
    return mensaje;
  }

  @SubscribeMessage('sendGroupMessage')
  async handleSendGroupMessage(@MessageBody() createMensajeDto: CreateMensajeDto, @ConnectedSocket() client: Socket) {
    const usuarioId: string = client.handshake.query.usuario_id as string;
    createMensajeDto.usuario_id = usuarioId;
    const mensaje = await this.mensajeService.createMensaje(createMensajeDto);
    this.server.to(createMensajeDto.chat_id).emit('receiveGroupMessage', mensaje);
    return mensaje;
  }

  @SubscribeMessage('joinGroup')
  async handleJoinGroup(@MessageBody() data: { grupoId: string }, @ConnectedSocket() client: Socket) {
    client.join(data.grupoId);
    console.log(`Client ${client.id} joined group ${data.grupoId}`);
  }

  @SubscribeMessage('leaveGroup')
  async handleLeaveGroup(@MessageBody() data: { grupoId: string }, @ConnectedSocket() client: Socket) {
    client.leave(data.grupoId);
    console.log(`Client ${client.id} left group ${data.grupoId}`);
  }
}
