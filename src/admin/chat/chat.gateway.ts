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
      try {
        const mensaje = await this.mensajeService.sendMessage(
          createMessageDto.chatId,
          createMessageDto.usuarioId,
          createMessageDto.contenido,
        );
        this.server.to(createMessageDto.chatId).emit('receiveMessage', mensaje);
      } catch (error) {
        // Manejo de errores
        client.emit('error', { message: 'Failed to send message.' });
        console.error('Error sending message:', error);
      }
    }
  
    @SubscribeMessage('joinChat')
    async handleJoinChat(
      @MessageBody('chatId') chatId: string,
      @ConnectedSocket() client: Socket,
    ): Promise<void> {
      try {
        const chat = await this.chatService.getChat(chatId);
        if (chat) {
          client.join(chatId);
          client.emit('joinedChat', { chatId, message: 'Successfully joined the chat.' });
        } else {
          client.emit('error', { message: 'Chat not found.' });
        }
      } catch (error) {
        // Manejo de errores
        client.emit('error', { message: 'Failed to join chat.' });
        console.error('Error joining chat:', error);
      }
    }
  
    @SubscribeMessage('leaveChat')
    handleLeaveChat(
      @MessageBody('chatId') chatId: string,
      @ConnectedSocket() client: Socket,
    ): void {
      try {
        client.leave(chatId);
        client.emit('leftChat', { chatId, message: 'Successfully left the chat.' });
      } catch (error) {
        // Manejo de errores
        client.emit('error', { message: 'Failed to leave chat.' });
        console.error('Error leaving chat:', error);
      }
    }
  
    @SubscribeMessage('getMessages')
    async handleGetMessages(
      @MessageBody() data: { chatId: string; page: number; limit: number },
      @ConnectedSocket() client: Socket,
    ): Promise<void> {
      const { chatId, page, limit } = data;
  
      try {
        // Validar parámetros de paginación
        const validPage = page > 0 ? page : 1;
        const validLimit = limit > 0 ? limit : 10;
  
        const messages = await this.chatService.getMessages(chatId, validPage, validLimit);
        client.emit('loadMessages', messages);
      } catch (error) {
        // Manejo de errores
        client.emit('error', { message: 'Failed to load messages.' });
        console.error('Error loading messages:', error);
      }
    }
  }
  