import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chat } from './entities/chat.entity';
import { Mensaje } from './mensaje/entities/mensaje.entity';
import { Grupo } from '../grupos/entities/grupo.entity';
import { Usuario } from 'src/users/entity/usuario.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat)
    private chatRepository: Repository<Chat>,
    @InjectRepository(Mensaje)
    private mensajeRepository: Repository<Mensaje>,
    @InjectRepository(Grupo)
    private grupoRepository: Repository<Grupo>,
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
  ) {}

  async createChat(grupoId: string): Promise<Chat> {
    const grupo = await this.grupoRepository.findOne({ where: { grupo_id: grupoId } });
    const chat = this.chatRepository.create({ grupo });
    return this.chatRepository.save(chat);
  }

  async getChat(chatId: string): Promise<Chat> {
    return this.chatRepository.findOne({ where: { chat_id: chatId } });
  }

  // Modificamos getMessages para aceptar page y limit, y añadimos paginación
  async getMessages(chatId: string, page: number, limit: number): Promise<Mensaje[]> {
    const skip = (page - 1) * limit;  // Calcula cuántos mensajes saltar

    return this.mensajeRepository.find({
      where: { chat: { chat_id: chatId } },
      relations: ['usuario'],  // Relación con los usuarios que enviaron los mensajes
      order: { fecha_envio: 'ASC' },  // Ordena los mensajes por fecha
      skip,  // Salta los primeros N mensajes
      take: limit,  // Toma solo los mensajes definidos por el límite
    });
  }

  // Método para enviar un mensaje
  async sendMessage(chatId: string, usuarioId: string, contenido: string): Promise<Mensaje> {
    const chat = await this.chatRepository.findOne({ where: { chat_id: chatId } });
    const usuario = await this.usuarioRepository.findOne({ where: { usuario_id: usuarioId } });
    const mensaje = this.mensajeRepository.create({ chat, usuario, contenido });
    return this.mensajeRepository.save(mensaje);
  }
}
