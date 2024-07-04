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
  
  @WebSocketGateway()
  export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server;
  
    constructor(private readonly chatService: ChatService) {}
  
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
    async handleSendMessage(@MessageBody() createChatDto: CreateChatDto, @ConnectedSocket() client: Socket) {
      const usuarioId: string = client.handshake.query.usuario_id as string;
      const chat = await this.chatService.createMensaje(createChatDto, usuarioId);
      this.server.emit('receiveMessage', chat);
      return chat;
    }
  
    @SubscribeMessage('sendGroupMessage')
    async handleSendGroupMessage(@MessageBody() createChatDto: CreateChatDto, @ConnectedSocket() client: Socket) {
      const usuarioId: string = client.handshake.query.usuario_id as string;
      const chat = await this.chatService.createMensaje(createChatDto, usuarioId);
      this.server.to(createChatDto.receptor_id).emit('receiveGroupMessage', chat);
      return chat;
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
  
