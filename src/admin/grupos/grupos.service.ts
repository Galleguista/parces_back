import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Grupo } from './entities/grupo.entity';
import { CreateGrupoDto } from './dto/create-grupo.dto';
import { ChatService } from 'src/chat/chat.service';
import { Usuario } from 'src/users/entity/usuario.entity';

@Injectable()
export class GrupoService {
  constructor(
    @InjectRepository(Grupo)
    private readonly grupoRepository: Repository<Grupo>,

    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,

    private readonly chatService: ChatService,
  ) {}

  async create(
    createGrupoDto: CreateGrupoDto,
    tipo_conversacion_id: string,
    usuario_id: string,
  ): Promise<Grupo> {
    const todosLosUsuarios = [usuario_id, ...createGrupoDto.userIds.map(u => typeof u === 'string' ? u : u.id)];
  
    const conversacion = await this.chatService.createConversation({
      tipo_conversacion_id,
      usuario_ids: todosLosUsuarios,
    });
  
    const grupo = this.grupoRepository.create({
      ...createGrupoDto,
      conversacion_id: conversacion.conversacion_id,
      usuario_id,
    });
  
    return this.grupoRepository.save(grupo);
  }  

  async findAll(): Promise<Grupo[]> {
    return this.grupoRepository.find();
  }

  async findAllByUser(usuarioId: string): Promise<Grupo[]> {
    const gruposComoAdmin = await this.grupoRepository.find({
      where: { usuario_id: usuarioId },
    });

    const userConversations = await this.chatService.getUserConversations(usuarioId);
    const conversacionIds = userConversations.map((uc) => uc.conversacion_id);

    if (!conversacionIds.length) return gruposComoAdmin;

    const gruposComoMiembro = await this.grupoRepository.find({
      where: { conversacion_id: In(conversacionIds) },
    });

    const grupos = [...gruposComoAdmin, ...gruposComoMiembro];
    const uniqueGrupos = grupos.filter(
      (value, index, self) =>
        index === self.findIndex((t) => t.grupo_id === value.grupo_id),
    );

    return uniqueGrupos;
  }

  async findOne(id: string): Promise<Grupo> {
    const grupo = await this.grupoRepository.findOne({ where: { grupo_id: id } });
    if (!grupo) {
      throw new NotFoundException(`No se encontró el grupo con ID ${id}`);
    }
    return grupo;
  }

  async getMembersOfGrupo(grupo_id: string) {
    const grupo = await this.findOne(grupo_id);

    const usuarios = await this.chatService.getUsersFromConversation(grupo.conversacion_id);

    return usuarios.map((usuario) => ({
      ...usuario,
      es_admin: usuario.usuario_id === grupo.usuario_id,
    }));
  }

  async addMember(grupo_id: string, usuario_id: string, admin_id: string) {
    const grupo = await this.findOne(grupo_id);

    if (grupo.usuario_id !== admin_id) {
      throw new ForbiddenException('No tienes permisos para añadir miembros.');
    }

    const usuarios = await this.chatService.getUsersFromConversation(grupo.conversacion_id);
    const yaEsMiembro = usuarios.some((u) => u.usuario_id === usuario_id);
    if (yaEsMiembro) throw new ConflictException('El usuario ya es miembro del grupo.');

    await this.chatService.addUserToConversation(grupo.conversacion_id, usuario_id);

    return { message: 'Miembro añadido correctamente.' };
  }

  async updateMember(
    grupo_id: string,
    usuario_id: string,
    updateData: Partial<Usuario>,
    admin_id: string,
  ) {
    const grupo = await this.findOne(grupo_id);
  
    if (grupo.usuario_id !== admin_id) {
      throw new ForbiddenException('Solo el administrador puede actualizar miembros.');
    }
  
    const usuario = await this.usuarioRepository.findOne({
      where: { usuario_id },
    });
  
    if (!usuario) throw new NotFoundException('Usuario no encontrado.');
  
    Object.assign(usuario, updateData);
    return this.usuarioRepository.save(usuario);
  }
  

  async removeMember(grupo_id: string, usuario_id: string, admin_id: string) {
    const grupo = await this.findOne(grupo_id);

    if (grupo.usuario_id !== admin_id) {
      throw new ForbiddenException('Solo el administrador puede eliminar miembros.');
    }

    await this.chatService.removeUserFromConversation(grupo.conversacion_id, usuario_id);

    return { message: `Usuario eliminado del grupo.` };
  }

  
}
