import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Grupo } from './entities/grupo.entity';
import { GrupoMiembro } from './entities/grupo-miembro.entity';
import { CreateGrupoDto } from './dto/create-grupo.dto';
import { AddGrupoMiembroDto } from './dto/add-grupo-miembro.dto';

@Injectable()
export class GruposService {
  constructor(
    @InjectRepository(Grupo)
    private readonly grupoRepository: Repository<Grupo>,
    @InjectRepository(GrupoMiembro)
    private readonly grupoMiembroRepository: Repository<GrupoMiembro>,
  ) {}

  async createGrupo(createGrupoDto: CreateGrupoDto): Promise<Grupo> {
    const grupo = this.grupoRepository.create(createGrupoDto);
    return this.grupoRepository.save(grupo);
  }

  async addMiembro(grupoId: string, addGrupoMiembroDto: AddGrupoMiembroDto): Promise<GrupoMiembro> {
    const grupoMiembro = this.grupoMiembroRepository.create({
      grupo_id: grupoId,
      ...addGrupoMiembroDto,
    });
    return this.grupoMiembroRepository.save(grupoMiembro);
  }

  async getGrupos(): Promise<Grupo[]> {
    return this.grupoRepository.find({ relations: ['miembros'] });
  }

  async addMemberToGroup(grupoId: string, usuarioId: string): Promise<GrupoMiembro> {
    const grupoMiembro = this.grupoMiembroRepository.create({
      grupo_id: grupoId,
      usuario_id: usuarioId,
    });
    return this.grupoMiembroRepository.save(grupoMiembro);
  }
}
