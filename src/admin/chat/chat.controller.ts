import { Controller, Post, Body, UseGuards, Request, Get, Param } from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('chat')
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @UseGuards(JwtAuthGuard)
  @Post('private')
  async createPrivateChat(@Body('receptorId') receptorId: string, @Request() req) {
    const usuarioId: string = req.user.sub;
    console.log('Creating private chat:', { usuarioId, receptorId });
    return this.chatService.createPrivateChat(usuarioId, receptorId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('group')
  async createGroupChat(@Body('grupoId') grupoId: string, @Body('usuarios') usuarios: string[]) {
    console.log('Creating group chat:', { grupoId, usuarios });
    return this.chatService.createGroupChat(grupoId, usuarios);
  }

  @UseGuards(JwtAuthGuard)
  @Get('user')
  async getUserChats(@Request() req) {
    const usuarioId: string = req.user.sub;
    console.log('Fetching chats for user:', { usuarioId });
    return this.chatService.getChatsByUser(usuarioId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':chatId/messages')
  async getChatMessages(@Param('chatId') chatId: string) {
    console.log('Fetching messages for chat:', { chatId });
    return this.chatService.getChatMessages(chatId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':chatId/messages')
  async sendMessage(@Param('chatId') chatId: string, @Request() req, @Body('contenido') contenido: string) {
    const usuarioId: string = req.user.sub;
    console.log('Sending message:', { chatId, usuarioId, contenido });
    return this.chatService.sendMessage(chatId, usuarioId, contenido);
  }
}
