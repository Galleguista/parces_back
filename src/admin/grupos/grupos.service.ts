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
import { Conversacion } from 'src/new-chat/conversacion/entities/conversacion.entity';
import { Usuario } from 'src/users/entity/usuario.entity';

@Injectable()
export class GrupoService {
  constructor(
    @InjectRepository(Grupo)
    private readonly grupoRepository: Repository<Grupo>,

    @InjectRepository(Conversacion)
    private readonly conversacionRepository: Repository<Conversacion>,

    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  // Crear un nuevo grupo
  async create(
    createGrupoDto: CreateGrupoDto,
    tipo_conversacion_id: string,
    usuario_id: string,
  ): Promise<Grupo> {
    const conversacion = this.conversacionRepository.create({
      user_ids: [{ id: usuario_id }, ...createGrupoDto.userIds],
      tipo_conversacion_id,
      fecha_creacion: new Date(),
    });
    const savedConversacion = await this.conversacionRepository.save(conversacion);

    const grupo = this.grupoRepository.create({
      ...createGrupoDto,
      conversacion_id: savedConversacion.conversacion_id,
      usuario_id, // Creador como administrador
    });

    return this.grupoRepository.save(grupo);
  }

  // Obtener todos los grupos
  async findAll(): Promise<Grupo[]> {
    return this.grupoRepository.find();
  }

  async findAllByUser(usuarioId: string): Promise<Grupo[]> {
    // Obtener los grupos donde el usuario es administrador
    const gruposComoAdmin = await this.grupoRepository.find({
      where: { usuario_id: usuarioId },
    });
  
    // Buscar todas las conversaciones donde el usuario es miembro
    const conversaciones = await this.conversacionRepository.find();
    const conversacionesComoMiembro = conversaciones.filter((conversacion) =>
      conversacion.user_ids.some((user) => user.id === usuarioId),
    );
  
    // Obtener los IDs de esas conversaciones
    const conversacionIds = conversacionesComoMiembro.map(
      (conv) => conv.conversacion_id,
    );
  
    if (conversacionIds.length === 0) {
      // Si el usuario no pertenece a ninguna conversación, devolver solo los grupos como administrador
      return gruposComoAdmin;
    }
  
    // Buscar los grupos asociados a esas conversaciones utilizando In
    const gruposComoMiembro = await this.grupoRepository.find({
      where: { conversacion_id: In(conversacionIds) },
    });
  
    // Combinar los resultados eliminando duplicados
    const grupos = [...gruposComoAdmin, ...gruposComoMiembro];
    const uniqueGrupos = grupos.filter(
      (value, index, self) =>
        index === self.findIndex((t) => t.grupo_id === value.grupo_id),
    );
  
    return uniqueGrupos;
  }

  // Buscar un grupo por ID
  async findOne(id: string): Promise<Grupo> {
    const grupo = await this.grupoRepository.findOne({ where: { grupo_id: id } });
    if (!grupo) {
      throw new NotFoundException(`No se encontró el grupo con ID ${id}`);
    }
    return grupo;
  }

  // Obtener miembros de un grupo (incluyendo administrador)
  async getMembersOfGrupo(grupo_id: string) {
    const grupo = await this.findOne(grupo_id);

    const conversacion = await this.conversacionRepository.findOne({
      where: { conversacion_id: grupo.conversacion_id },
    });

    if (!conversacion) {
      throw new NotFoundException(
        `No se encontró la conversación para el grupo con ID ${grupo_id}`,
      );
    }

    const userIds = conversacion.user_ids.map((user) => user.id);
    const usuarios = await this.usuarioRepository.findByIds(userIds);

    return usuarios.map((usuario) => ({
      ...usuario,
      es_admin: usuario.usuario_id === grupo.usuario_id, // Identificar al administrador
    }));
  }

  // Añadir miembro al grupo
  async addMember(grupo_id: string, usuario_id: string, admin_id: string) {
    const grupo = await this.findOne(grupo_id);

    if (grupo.usuario_id !== admin_id) {
      throw new ForbiddenException('No tienes permisos para añadir miembros a este grupo.');
    }

    const conversacion = await this.conversacionRepository.findOne({
      where: { conversacion_id: grupo.conversacion_id },
    });

    if (!conversacion) {
      throw new NotFoundException(
        `No se encontró la conversación para el grupo con ID ${grupo_id}`,
      );
    }

    const isAlreadyMember = conversacion.user_ids.some((user) => user.id === usuario_id);
    if (isAlreadyMember) {
      throw new ConflictException('El usuario ya es miembro del grupo.');
    }

    conversacion.user_ids.push({ id: usuario_id });
    await this.conversacionRepository.save(conversacion);

    return conversacion;
  }

  // Actualizar miembro del grupo
  async updateMember(
    grupo_id: string,
    usuario_id: string,
    updateData: any,
    admin_id: string,
  ) {
    const grupo = await this.findOne(grupo_id);

    if (grupo.usuario_id !== admin_id) {
      throw new ForbiddenException('Solo el administrador puede actualizar miembros.');
    }

    const conversacion = await this.conversacionRepository.findOne({
      where: { conversacion_id: grupo.conversacion_id },
    });

    if (!conversacion) throw new NotFoundException('Conversación no encontrada.');

    const miembro = conversacion.user_ids.find((user) => user.id === usuario_id);
    if (!miembro) throw new NotFoundException('Usuario no es miembro del grupo.');

    Object.assign(miembro, updateData); // Actualiza los datos del miembro
    await this.conversacionRepository.save(conversacion);

    return miembro;
  }

  // Eliminar miembro del grupo
  async removeMember(grupo_id: string, usuario_id: string, admin_id: string) {
    const grupo = await this.findOne(grupo_id);

    if (grupo.usuario_id !== admin_id) {
      throw new ForbiddenException('Solo el administrador puede eliminar miembros.');
    }

    const conversacion = await this.conversacionRepository.findOne({
      where: { conversacion_id: grupo.conversacion_id },
    });

    if (!conversacion) throw new NotFoundException('Conversación no encontrada.');

    const index = conversacion.user_ids.findIndex((user) => user.id === usuario_id);
    if (index === -1) throw new NotFoundException('Usuario no es miembro del grupo.');

    conversacion.user_ids.splice(index, 1); // Elimina el miembro
    await this.conversacionRepository.save(conversacion);

    return { message: `Usuario eliminado del grupo.` };
  }
}
