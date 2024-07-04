import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chat } from './entities/chat.entity';
import { CreateChatDto } from './dto/create-chat.dto';

@Injectable()
export class ChatService {
  getChats(usuarioId: string, receptorId: string) {
    throw new Error('Method not implemented.');
  }
  createChat(createChatDto: CreateChatDto, usuarioId: string) {
    throw new Error('Method not implemented.');
  }
  constructor(
    @InjectRepository(Chat)
    private mensajeRepository: Repository<Chat>,
  ) {}

  async createMensaje(createMensajeDto: CreateChatDto, usuarioId: string): Promise<Chat> {
    const newMensaje = this.mensajeRepository.create({ ...createMensajeDto, usuario_id: usuarioId });
    return this.mensajeRepository.save(newMensaje);
  }

  async getMensajes(filter: { receptor_id: string }): Promise<Chat[]> {
    return this.mensajeRepository.find({
      where: { receptor_id: filter.receptor_id },
      order: { fecha_envio: 'ASC' },
    });
  }
}
