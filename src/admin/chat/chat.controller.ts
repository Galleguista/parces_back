import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateMessageDto } from './dto/create-mensage.dto';


@Controller('chat')
export class ChatController {
    constructor(private readonly chatService: ChatService) {}

    @Post(':grupoId')
    createChat(@Param('grupoId') grupoId: string) {
        return this.chatService.createChat(grupoId);
    }

    @Get(':chatId')
    getChat(@Param('chatId') chatId: string) {
        return this.chatService.getChat(chatId);
    }

    @Get(':chatId/mensajes')
    getMessages(@Param('chatId') chatId: string) {
        return this.chatService.getMessages(chatId);
    }

    @Post(':chatId/messages')
    sendMessage(
        @Param('chatId') chatId: string,
        @Body() createMessageDto: CreateMessageDto,
    ) {
        return this.chatService.sendMessage(chatId, createMessageDto.usuarioId, createMessageDto.contenido);
    }
}
