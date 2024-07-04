import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateGrupoDto } from './dto/create-grupo.dto';
import { AddGrupoMiembroDto } from './dto/add-grupo-miembro.dto';
import { ChatService } from '../chat/chat.service';
import { Grupo } from './entities/grupo.entity';
import { GrupoMiembro } from './entities/grupo-miembro.entity';
import { Chat } from '../chat/entities/chat.entity';

@Injectable()
export class GruposService {
  constructor(
    @InjectRepository(Grupo)
    private grupoRepository: Repository<Grupo>,
    @InjectRepository(GrupoMiembro)
    private grupoMiembroRepository: Repository<GrupoMiembro>,
    private readonly chatService: ChatService,
  ) {}

  async createGrupo(createGrupoDto: CreateGrupoDto): Promise<Grupo> {
    const newGrupo = this.grupoRepository.create(createGrupoDto);
    return this.grupoRepository.save(newGrupo);
  }

  async addMiembro(grupoId: string, addGrupoMiembroDto: AddGrupoMiembroDto): Promise<GrupoMiembro> {
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

  async getMensajes(grupoId: string): Promise<Chat[]> {
    return this.chatService.getMensajes({ receptor_id: grupoId });
  }

  async createMensaje(grupoId: string, contenido: string, usuarioId: string): Promise<Chat> {
    return this.chatService.createMensaje({ contenido, receptor_id: grupoId }, usuarioId);
  }
}
