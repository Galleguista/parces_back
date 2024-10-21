import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Grupo } from './entities/grupo.entity';

import { Usuario } from 'src/users/entity/usuario.entity';

@Injectable()
export class GrupoService {
    constructor(
        @InjectRepository(Grupo)
        private grupoRepository: Repository<Grupo>,
        @InjectRepository(Usuario)
        private usuarioRepository: Repository<Usuario>,
    ) {}

    async createGrupo(nombre: string, descripcion: string): Promise<Grupo> {
        const grupo = this.grupoRepository.create({ nombre, descripcion });
        return this.grupoRepository.save(grupo);
    }

    async getGrupo(grupoId: string): Promise<Grupo> {
        return this.grupoRepository.findOne({ where: { grupo_id: grupoId }, relations: ['miembros'] });
    }

    async getAllGrupos(): Promise<Grupo[]> {
        return this.grupoRepository.find({ relations: ['miembros'] });
    }
}
