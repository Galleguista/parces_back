import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { MensajeService } from './mensaje.service';

@Controller('mensaje')
export class MensajeController {
    constructor(private readonly mensajeService: MensajeService) {}

    @Post()
    sendMessage(
        @Body('chatId') chatId: string,
        @Body('usuarioId') usuarioId: string,
        @Body('contenido') contenido: string,
    ) {
        return this.mensajeService.sendMessage(chatId, usuarioId, contenido);
    }

    @Get(':mensajeId')
    getMessage(@Param('mensajeId') mensajeId: string) {
        return this.mensajeService.getMessage(mensajeId);
    }
}
