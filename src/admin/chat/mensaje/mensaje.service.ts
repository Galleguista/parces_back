import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Mensaje } from './entities/mensaje.entity';
import { Chat } from '../entities/chat.entity';
import { Usuario } from 'src/users/entity/usuario.entity';



@Injectable()
export class MensajeService {
    constructor(
        @InjectRepository(Mensaje)
        private mensajeRepository: Repository<Mensaje>,
        @InjectRepository(Chat)
        private chatRepository: Repository<Chat>,
        @InjectRepository(Usuario)
        private usuarioRepository: Repository<Usuario>,
    ) {}

    async sendMessage(chatId: string, usuarioId: string, contenido: string): Promise<Mensaje> {
        const chat = await this.chatRepository.findOne({ where: { chat_id: chatId } });
        const usuario = await this.usuarioRepository.findOne({ where: { usuario_id: usuarioId } });
        const mensaje = this.mensajeRepository.create({ chat, usuario, contenido });
        return this.mensajeRepository.save(mensaje);
    }

    async getMessage(mensajeId: string): Promise<Mensaje> {
        return this.mensajeRepository.findOne({ where: { mensaje_id: mensajeId }, relations: ['chat', 'usuario'] });
    }
}
