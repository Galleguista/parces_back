import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  async create(@Body() createChatDto: CreateChatDto, @Request() req) {
    const usuarioId: string = req.user.usuario_id;
    return this.chatService.createChat(createChatDto, usuarioId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('mensajes')
  async getChats(@Request() req) {
    const usuarioId: string = req.user.usuario_id;
    const receptorId: string = req.query.receptorId;
    return this.chatService.getChats(usuarioId, receptorId);
  }
}

