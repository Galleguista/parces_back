import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chat } from './entities/chat.entity';
import { CreateChatDto } from './dto/create-chat.dto';
import { CreateMensajeDto } from './dto/create-mensage.dto';


@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat)
    private chatRepository: Repository<Chat>,
  ) {}

  async createChat(createChatDto: CreateChatDto, usuarioId: string): Promise<Chat> {
    const newChat = this.chatRepository.create({ ...createChatDto, usuario_id: usuarioId });
    return this.chatRepository.save(newChat);
  }

  async getChats(usuarioId: string): Promise<Chat[]> {
    return this.chatRepository.find({
      where: [
        { usuario_id: usuarioId },
        { receptor_id: usuarioId }
      ]
    });
  }

  async getChatMessages(usuarioId: string, receptorId: string): Promise<Chat[]> {
    return this.chatRepository.find({
      where: [
        { usuario_id: usuarioId, receptor_id: receptorId },
        { usuario_id: receptorId, receptor_id: usuarioId },
      ],
      order: { fecha_envio: 'ASC' },
    });
  }

  async createMensaje(chatId: string, createMensajeDto: CreateMensajeDto, usuarioId: string): Promise<Chat> {
    const newMensaje = this.chatRepository.create({
      ...createMensajeDto,
      chat_id: chatId,
      usuario_id: usuarioId,
    });
    return this.chatRepository.save(newMensaje);
  }

  async getMensajes(chatId: string): Promise<Chat[]> {
    return this.chatRepository.find({
      where: { chat_id: chatId },
      order: { fecha_envio: 'ASC' },
    });
  }
}
