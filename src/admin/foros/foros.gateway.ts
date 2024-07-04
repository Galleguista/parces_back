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
  import { ForosService } from './foros.service';
import { CreateForoDto } from './dto/create-foro.dto';
  
  
  @WebSocketGateway()
  export class ForosGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server;
  
    constructor(private readonly forosService: ForosService) {}
  
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
    async handleSendMessage(@MessageBody() CreateForoDto: CreateForoDto, @ConnectedSocket() client: Socket) {
      this.server.emit('receiveMessage', CreateForoDto);
      return CreateForoDto;
    }
  
    @SubscribeMessage('joinForo')
    async handleJoinForo(@MessageBody() data: { foroId: string }, @ConnectedSocket() client: Socket) {
      client.join(data.foroId);
      console.log(`Client ${client.id} joined foro ${data.foroId}`);
    }
  
    @SubscribeMessage('leaveForo')
    async handleLeaveForo(@MessageBody() data: { foroId: string }, @ConnectedSocket() client: Socket) {
      client.leave(data.foroId);
      console.log(`Client ${client.id} left foro ${data.foroId}`);
    }
  }
  