import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateGrupoDto } from './dto/create-grupo.dto';
import { AddGrupoMiembroDto } from './dto/add-grupo-miembro.dto';
import { Grupo } from './entities/grupo.entity';
import { GrupoMiembro } from './entities/grupo-miembro.entity';
import { Chat } from '../chat/entities/chat.entity';

import { ChatService } from '../chat/chat.service';
import { CreateMensajeDto } from '../chat/dto/create-mensage.dto';

@Injectable()
export class GruposService {
  constructor(
    @InjectRepository(Grupo)
    private grupoRepository: Repository<Grupo>,
    @InjectRepository(GrupoMiembro)
    private grupoMiembroRepository: Repository<GrupoMiembro>,
    @InjectRepository(Chat)
    private chatRepository: Repository<Chat>,
    private chatService: ChatService,
  ) {}

  async createGrupo(createGrupoDto: CreateGrupoDto): Promise<Grupo> {
    const newGrupo = this.grupoRepository.create(createGrupoDto);
    const savedGrupo = await this.grupoRepository.save(newGrupo);

    // Crear un chat asociado al grupo
    const newChat = this.chatRepository.create({
      usuario_id: savedGrupo.grupo_id, // Asociar el chat al grupo
      receptor_id: savedGrupo.grupo_id, // Usar el mismo ID para receptor
      contenido: 'Chat de grupo creado.',
    });
    await this.chatRepository.save(newChat);

    return savedGrupo;
  }

  async addMiembro(grupoId: string, addGrupoMiembroDto: AddGrupoMiembroDto): Promise<GrupoMiembro> {
    const grupo = await this.grupoRepository.findOne({ where: { grupo_id: grupoId } });
    if (!grupo) {
      throw new NotFoundException('Grupo no encontrado');
    }

    const grupoMiembro = this.grupoMiembroRepository.create({
      grupo_id: grupoId,
      usuario_id: addGrupoMiembroDto.usuario_id,
    });
    return this.grupoMiembroRepository.save(grupoMiembro);
  }

  async getGrupoById(grupoId: string): Promise<Grupo> {
    const grupo = await this.grupoRepository.findOne({ where: { grupo_id: grupoId }, relations: ['miembros'] });
    if (!grupo) {
      throw new NotFoundException('Grupo no encontrado');
    }
    return grupo;
  }

  async getGrupos(): Promise<Grupo[]> {
    return this.grupoRepository.find({ relations: ['miembros'] });
  }

  async getMensajes(grupoId: string): Promise<Chat[]> {
    return this.chatRepository.find({
      where: { receptor_id: grupoId } as any,
      order: { fecha_envio: 'ASC' as any },
    });
  }

  async createMensaje(grupoId: string, mensajeDto: CreateMensajeDto, usuarioId: string): Promise<Chat> {
    const newMensaje = this.chatRepository.create({
      ...mensajeDto,
      receptor_id: grupoId,
      usuario_id: usuarioId,
    });
    return this.chatRepository.save(newMensaje);
  }
}
