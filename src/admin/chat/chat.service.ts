// chat.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chat } from './entities/chat.entity';
import { Usuario } from 'src/users/entity/usuario.entity';
import { Mensaje } from './mensaje/entities/mensaje.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat)
    private chatRepository: Repository<Chat>,
    @InjectRepository(Mensaje)
    private mensajeRepository: Repository<Mensaje>,
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
  ) {}

  async createPrivateChat(usuarioId: string, receptorId: string): Promise<Chat> {
    const usuario = await this.usuarioRepository.findOne({ where: { usuario_id: usuarioId } });
    const receptor = await this.usuarioRepository.findOne({ where: { usuario_id: receptorId } });

    if (!usuario || !receptor) {
      throw new NotFoundException('Usuario o receptor no encontrados');
    }

    const chat = this.chatRepository.create({
      usuarios: [usuario, receptor],
    });

    return this.chatRepository.save(chat);
  }

  async createGroupChat(grupoId: string, usuarios: string[]): Promise<Chat> {
    const usuariosEntidades = await this.usuarioRepository.findByIds(usuarios);

    if (usuariosEntidades.length !== usuarios.length) {
        throw new NotFoundException('Algunos usuarios no fueron encontrados');
    }

    const chat = this.chatRepository.create({
        grupo_id: grupoId,
        usuarios: usuariosEntidades,
    });

    return this.chatRepository.save(chat);
}


  async getChatsByUser(usuarioId: string): Promise<Chat[]> {
    return this.chatRepository
      .createQueryBuilder('chat')
      .leftJoinAndSelect('chat.usuarios', 'usuario')
      .where('usuario.usuario_id = :usuarioId', { usuarioId })
      .getMany();
  }

  async getChatMessages(chatId: string): Promise<Mensaje[]> {
    return this.mensajeRepository.find({
      where: { chat_id: chatId },
      order: { fecha_envio: 'ASC' },
      relations: ['usuario'],
    });
  }

  async sendMessage(chatId: string, usuarioId: string, contenido: string): Promise<Mensaje> {
    const chat = await this.chatRepository.findOne({ where: { chat_id: chatId }, relations: ['usuarios'] });
    if (!chat) {
      throw new NotFoundException('Chat no encontrado');
    }

    const usuario = await this.usuarioRepository.findOne({ where: { usuario_id: usuarioId } });
    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const mensaje = this.mensajeRepository.create({
      chat_id: chatId,
      usuario_id: usuarioId,
      contenido,
      fecha_envio: new Date(),
    });

    return this.mensajeRepository.save(mensaje);
  }
}
