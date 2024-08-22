import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';


import { MensajeService } from './mensaje/mensaje.service';
import { CreateMessageDto } from './dto/create-mensage.dto';

@WebSocketGateway({ cors: true })
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(
      private readonly chatService: ChatService,
      private readonly mensajeService: MensajeService,
  ) {}

  @SubscribeMessage('sendMessage')
  async handleMessage(
      @MessageBody() createMessageDto: CreateMessageDto,
      @ConnectedSocket() client: Socket,
  ): Promise<void> {
      const mensaje = await this.mensajeService.sendMessage(
          createMessageDto.chatId,
          createMessageDto.usuarioId,
          createMessageDto.contenido,
      );
      this.server.to(createMessageDto.chatId).emit('receiveMessage', mensaje);
  }

  @SubscribeMessage('joinChat')
  async handleJoinChat(
      @MessageBody('chatId') chatId: string,
      @ConnectedSocket() client: Socket,
  ): Promise<void> {
      const chat = await this.chatService.getChat(chatId);
      if (chat) {
          client.join(chatId);
          client.emit('joinedChat', { chatId, message: 'Successfully joined the chat.' });
      } else {
          client.emit('error', { message: 'Chat not found.' });
      }
  }

  @SubscribeMessage('leaveChat')
  handleLeaveChat(
      @MessageBody('chatId') chatId: string,
      @ConnectedSocket() client: Socket,
  ): void {
      client.leave(chatId);
      client.emit('leftChat', { chatId, message: 'Successfully left the chat.' });
  }

  @SubscribeMessage('getMessages')
  async handleGetMessages(
      @MessageBody('chatId') chatId: string,
      @ConnectedSocket() client: Socket,
  ): Promise<void> {
      const messages = await this.chatService.getMessages(chatId);
      client.emit('loadMessages', messages);
  }
}
