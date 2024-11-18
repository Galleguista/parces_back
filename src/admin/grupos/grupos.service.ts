import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

  /**
   * Crea un nuevo grupo con un administrador y una conversación asociada.
   * @param createGrupoDto Datos del grupo.
   * @param tipo_conversacion_id Tipo de conversación para la conversación asociada.
   * @param usuario_id ID del usuario que crea el grupo (administrador).
   * @returns Grupo creado con la conversación asociada.
   */
  async create(createGrupoDto: CreateGrupoDto, tipo_conversacion_id: string, usuario_id: string): Promise<Grupo> {
    // Primero, crea la conversación con los miembros iniciales y el administrador
    const conversacion = this.conversacionRepository.create({
      user_ids: [{ id: usuario_id }, ...createGrupoDto.userIds],
      tipo_conversacion_id: tipo_conversacion_id,
      fecha_creacion: new Date(),
    });
    const savedConversacion = await this.conversacionRepository.save(conversacion);

    // Luego, crea el grupo con el conversacion_id asignado y el administrador
    const grupo = this.grupoRepository.create({
      ...createGrupoDto,
      conversacion_id: savedConversacion.conversacion_id,
      usuario_id, // Asigna el usuario que crea el grupo como administrador
    });

    return this.grupoRepository.save(grupo);
  }

  async addMember(grupo_id: string, usuario_id: string, admin_id: string) {
    // Busca el grupo
    const grupo = await this.findOne(grupo_id);
  
    // Validar si el usuario autenticado es el administrador
    if (grupo.usuario_id !== admin_id) {
      throw new ForbiddenException('No tienes permisos para añadir miembros a este grupo.');
    }
  
    // Busca la conversación asociada
    const conversacion = await this.conversacionRepository.findOne({
      where: { conversacion_id: grupo.conversacion_id },
    });
  
    if (!conversacion) {
      throw new NotFoundException(`No se encontró la conversación para el grupo con ID ${grupo_id}`);
    }
  
    // Verifica si el usuario ya es miembro
    const isAlreadyMember = conversacion.user_ids.some(user => user.id === usuario_id);
    if (isAlreadyMember) {
      throw new ConflictException('El usuario ya es miembro del grupo.');
    }
  
    // Añade el nuevo usuario
    conversacion.user_ids.push({ id: usuario_id });
    await this.conversacionRepository.save(conversacion);
  
    return conversacion;
  }

  /**
   * Obtiene todos los grupos.
   * @returns Lista de todos los grupos.
   */
  async findAll(): Promise<Grupo[]> {
    return await this.grupoRepository.find();
  }

  /**
   * Busca un grupo por ID.
   * @param id ID del grupo.
   * @returns Información del grupo.
   */
  async findOne(id: string): Promise<Grupo> {
    const grupo = await this.grupoRepository.findOne({ where: { grupo_id: id } });
    if (!grupo) {
      throw new NotFoundException(`No se encontró el grupo con ID ${id}`);
    }
    return grupo;
  }

  /**
   * Obtiene los miembros de un grupo, incluyendo el administrador, basado en el `conversacion_id` asociado.
   * @param grupo_id ID del grupo.
   * @returns Lista de usuarios miembros de la conversación y el administrador.
   */
  async getMembersOfGrupo(grupo_id: string) {
    const grupo = await this.grupoRepository.findOne({ where: { grupo_id: grupo_id } });
    if (!grupo) {
      throw new NotFoundException(`No se encontró el grupo con ID ${grupo_id}`);
    }

    const conversacion = await this.conversacionRepository.findOne({
      where: { conversacion_id: grupo.conversacion_id },
    });

    if (!conversacion) {
      throw new NotFoundException(`No se encontró la conversación con ID ${grupo.conversacion_id}`);
    }

    const userIds = conversacion.user_ids.map((user) => user.id);
    const usuarios = await this.usuarioRepository.findByIds(userIds);

    // Añade el campo `es_admin` a cada usuario
    const usuariosConAdminFlag = usuarios.map((usuario) => ({
      ...usuario,
      es_admin: usuario.usuario_id === grupo.usuario_id, // Marca como admin al creador
    }));

    return usuariosConAdminFlag;
  }

  /**
   * Añade un miembro a la conversación de un grupo y actualiza el JSON `user_ids`.
   * @param grupo_id ID del grupo.
   * @param usuario_id ID del usuario a añadir.
   * @returns Conversación actualizada.
   */

}
