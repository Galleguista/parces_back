import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { SendMessageDto } from './dto/send-message.dto';
import { JoinConversationDto } from './dto/join-conversation.dto';
import { WsUser, JwtPayload } from './decorators/ws-user.decorator';

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatService: ChatService) {}

  handleConnection(client: Socket) {
    console.log('[ChatGateway] Cliente conectado:', client.id);
    const token = client.handshake?.auth?.token;
    console.log('[ChatGateway] Token recibido en handshake:', token);
  }

  handleDisconnect(client: Socket) {
    console.log('[ChatGateway] Cliente desconectado:', client.id);
  }

  @SubscribeMessage('join_conversation')
  async handleJoinConversation(
    @MessageBody() data: JoinConversationDto,
    @ConnectedSocket() client: Socket,
  ) {
    console.log('[ChatGateway] Cliente se une a conversación:', data.conversacion_id);
    client.join(data.conversacion_id);
  }

  @SubscribeMessage('leave_conversation')
  async handleLeaveConversation(
    @MessageBody() data: JoinConversationDto,
    @ConnectedSocket() client: Socket,
  ) {
    console.log('[ChatGateway] Cliente sale de conversación:', data.conversacion_id);
    client.leave(data.conversacion_id);
  }

  @SubscribeMessage('send_message')
  async handleSendMessage(
    @MessageBody() payload: SendMessageDto,
    @WsUser(false) user: JwtPayload, // <-- liberamos validación por ahora
  ) {
    console.log('[ChatGateway] Enviando mensaje como usuario:', user?.usuario);

    const message = await this.chatService.sendMessage({
      ...payload,
      usuario_id: user?.sub ?? 'anonimo', // fallback
    });

    this.server.to(payload.conversacion_id).emit('new_message', message);

    const participantes = await this.chatService.getUsersFromConversation(payload.conversacion_id);
    for (const u of participantes) {
      this.server.to(u.usuario_id).emit('conversation_updated', {
        conversacion_id: payload.conversacion_id,
        ultimoMensaje: message,
      });
    }
  }

  @SubscribeMessage('get_conversations')
  async handleGetConversations(
    @WsUser(false) user: JwtPayload,
    @ConnectedSocket() client: Socket,
  ) {
    console.log('[ChatGateway] Usuario solicitando conversaciones:', user?.usuario);

    const conversations = await this.chatService.getUserConversations(user?.sub ?? '');
    console.log('[ChatGateway] Conversaciones encontradas:', conversations);

    client.emit('conversation_list', conversations);
  }
}
