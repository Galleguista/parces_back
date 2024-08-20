import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Grupo } from './entities/grupo.entity';
import { GrupoMiembro } from './entities/grupo-miembro.entity';
import { CreateGrupoDto } from './dto/create-grupo.dto';
import { Chat } from '../chat/entities/chat.entity';
import { Usuario } from 'src/users/entity/usuario.entity';

@Injectable()
export class GruposService {
  constructor(
    @InjectRepository(Grupo)
    private readonly grupoRepository: Repository<Grupo>,
    @InjectRepository(GrupoMiembro)
    private readonly grupoMiembroRepository: Repository<GrupoMiembro>,
    @InjectRepository(Chat)
    private readonly chatRepository: Repository<Chat>,
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  // grupos.service.ts
async createGrupo(createGrupoDto: CreateGrupoDto, usuarioId: string): Promise<Grupo> {
  const grupo = this.grupoRepository.create(createGrupoDto);
  await this.grupoRepository.save(grupo);

  // Obtener el usuario creador y verificar su existencia
  const usuarioCreador = await this.usuarioRepository.findOne({ where: { usuario_id: usuarioId } });
  if (!usuarioCreador) {
    throw new NotFoundException(`Creador del grupo no encontrado: ${usuarioId}`);
  }

  // Asegurar que el usuario creador esté incluido en los miembros del grupo
  const usuariosIds = [usuarioId, ...createGrupoDto.usuariosIds];
  const usuariosEntidades = await this.usuarioRepository.findByIds(usuariosIds);

  // Creación del chat grupal
  const chat = this.chatRepository.create({
    grupo_id: grupo.grupo_id,
    usuarios: usuariosEntidades,
  });
  await this.chatRepository.save(chat);

  // Asignación de miembros al grupo
  usuariosEntidades.forEach(async usuario => {
    const grupoMiembro = this.grupoMiembroRepository.create({
      grupo_id: grupo.grupo_id,
      usuario_id: usuario.usuario_id,
      usuario,
    });
    await this.grupoMiembroRepository.save(grupoMiembro);
  });

  return grupo;
}


  async addMemberToGroup(grupoId: string, usuarioId: string): Promise<GrupoMiembro> {
    console.log(`addMemberToGroup: grupoId=${grupoId}, usuarioId=${usuarioId}`); // Log de depuración
    if (!usuarioId) {
      throw new Error('El usuarioId es nulo o indefinido');
    }

    const usuario = await this.usuarioRepository.findOne({ where: { usuario_id: usuarioId } });
    if (!usuario) {
      throw new Error(`Usuario con ID ${usuarioId} no encontrado.`);
    }

    const grupoMiembro = this.grupoMiembroRepository.create({
      grupo_id: grupoId,
      usuario_id: usuarioId,
      usuario: usuario,
    });

    return this.grupoMiembroRepository.save(grupoMiembro);
  }

  async getGrupos(): Promise<Grupo[]> {
    return this.grupoRepository.find({ relations: ['miembros'] });
  }
}
