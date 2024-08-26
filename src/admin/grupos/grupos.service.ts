import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Grupo } from './entities/grupo.entity';
import { GrupoMiembro } from './entities/grupo-miembro.entity';
import { Usuario } from 'src/users/entity/usuario.entity';

@Injectable()
export class GrupoService {
    constructor(
        @InjectRepository(Grupo)
        private grupoRepository: Repository<Grupo>,
        @InjectRepository(GrupoMiembro)
        private grupoMiembroRepository: Repository<GrupoMiembro>,
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

    async addMiembro(grupoId: string, usuarioId: string): Promise<GrupoMiembro> {
        const grupo = await this.grupoRepository.findOne({ where: { grupo_id: grupoId } });
        const usuario = await this.usuarioRepository.findOne({ where: { usuario_id: usuarioId } });
        const grupoMiembro = this.grupoMiembroRepository.create({ grupo, usuario });
        return this.grupoMiembroRepository.save(grupoMiembro);
    }

    async getAllGrupos(): Promise<Grupo[]> {
        return this.grupoRepository.find({ relations: ['miembros'] });
    }
}
