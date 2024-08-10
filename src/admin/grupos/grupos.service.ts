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

  async createGrupo(createGrupoDto: CreateGrupoDto, usuarioIds: string[]): Promise<Grupo> {
    const grupo = this.grupoRepository.create(createGrupoDto);
    await this.grupoRepository.save(grupo);

    // Verificación de usuarios
    const usuariosEntidades = await this.usuarioRepository.findByIds(usuarioIds);
    if (usuariosEntidades.length !== usuarioIds.length) {
      const foundIds = usuariosEntidades.map(usuario => usuario.usuario_id);
      const missingIds = usuarioIds.filter(id => !foundIds.includes(id));
      console.error('Usuarios no encontrados:', missingIds); // Log de depuración
      throw new NotFoundException('Algunos usuarios no fueron encontrados');
    }

    // Creación del chat grupal
    const chat = this.chatRepository.create({
      grupo_id: grupo.grupo_id,
      usuarios: usuariosEntidades,
    });

    await this.chatRepository.save(chat);

    // Asignación de miembros al grupo
    for (const usuario of usuariosEntidades) {
      const grupoMiembro = this.grupoMiembroRepository.create({
        grupo_id: grupo.grupo_id,
        usuario_id: usuario.usuario_id,
        usuario: usuario,
      });
      await this.grupoMiembroRepository.save(grupoMiembro);
    }

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
