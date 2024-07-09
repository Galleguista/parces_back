import { Controller, Get, Post, Body, UseGuards, Param, Request } from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateChatDto } from './dto/create-chat.dto';
import { CreateMensajeDto } from './dto/create-mensage.dto';


@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  async createChat(@Body() createChatDto: CreateChatDto, @Request() req) {
    const usuarioId: string = req.user.usuario_id;
    return this.chatService.createChat(createChatDto, usuarioId);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getChats(@Request() req) {
    const usuarioId: string = req.user.usuario_id;
    return this.chatService.getChats(usuarioId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('mensajes/:receptorId')
  async getChatMessages(@Request() req, @Param('receptorId') receptorId: string) {
    const usuarioId: string = req.user.usuario_id;
    return this.chatService.getChatMessages(usuarioId, receptorId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':chatId/mensajes')
  async createMensaje(
    @Param('chatId') chatId: string,
    @Body() createMensajeDto: CreateMensajeDto,
    @Request() req
  ) {
    const usuarioId: string = req.user.usuario_id;
    return this.chatService.createMensaje(chatId, createMensajeDto, usuarioId);
  }
}
