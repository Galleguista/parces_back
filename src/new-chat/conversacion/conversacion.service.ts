import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Conversacion } from './entities/conversacion.entity';
import { CreateConversacionDto } from './dto/create-conversacion.dto';

@Injectable()
export class ConversacionService {
  constructor(
    @InjectRepository(Conversacion)
    private readonly conversacionRepository: Repository<Conversacion>,
  ) {}

  /**
   * Crea una nueva conversación.
   * @param createConversacionDto Datos de la conversación.
   * @returns La conversación creada.
   */
  async create(createConversacionDto: CreateConversacionDto): Promise<Conversacion> {
    const nuevaConversacion = this.conversacionRepository.create(createConversacionDto);
    return await this.conversacionRepository.save(nuevaConversacion);
  }

  /**
   * Obtiene una conversación por ID.
   * @param id ID de la conversación.
   * @returns La conversación encontrada.
   */
  async findOne(id: string): Promise<Conversacion> {
    const conversacion = await this.conversacionRepository.findOne({ where: { conversacion_id: id } });
    if (!conversacion) throw new NotFoundException(`No se encontró la conversación con ID ${id}`);
    return conversacion;
  }

  /**
   * Obtiene todas las conversaciones.
   * @returns Lista de conversaciones.
   */
  async findAll(): Promise<Conversacion[]> {
    return await this.conversacionRepository.find();
  }

  /**
   * Verifica si un usuario es miembro de una conversación.
   * @param conversacionId ID de la conversación.
   * @param userId ID del usuario.
   * @returns Verdadero si el usuario es miembro, falso si no.
   */
  async isUserMember(conversacionId: string, userId: string): Promise<boolean> {
    const conversacion = await this.findOne(conversacionId);
    return conversacion.user_ids.some(member => member.id === userId);
  }

  /**
   * Crea o recupera una conversación privada entre dos usuarios.
   * @param currentUserId ID del usuario autenticado.
   * @param memberId ID del otro usuario.
   * @returns La conversación existente o una nueva.
   */
  async createOrGetPrivateChat(currentUserId: string, memberId: string): Promise<Conversacion> {
    // Verifica si ya existe una conversación privada entre los dos usuarios
    const userIdsJson = JSON.stringify([{ id: currentUserId }, { id: memberId }]);

    let conversacion = await this.conversacionRepository
      .createQueryBuilder('conversacion')
      .where('conversacion.tipo_conversacion_id = :tipoId', { tipoId: '7c4fc440-7281-40d3-a96e-303e2bb8cd84' }) // ID de conversación privada
      .andWhere('conversacion.user_ids @> :userIds1', { userIds1: userIdsJson })
      .orWhere('conversacion.user_ids @> :userIds2', {
        userIds2: JSON.stringify([{ id: memberId }, { id: currentUserId }]),
      })
      .getOne();

    // Si no existe, crearla
    if (!conversacion) {
      const nuevaConversacion = this.conversacionRepository.create({
        tipo_conversacion_id: '7c4fc440-7281-40d3-a96e-303e2bb8cd84',
        user_ids: [{ id: currentUserId }, { id: memberId }],
        fecha_creacion: new Date(),
      });
      conversacion = await this.conversacionRepository.save(nuevaConversacion);
    }

    return conversacion;
  }

  /**
   * Agrega usuarios a una conversación existente.
   * @param conversacionId ID de la conversación.
   * @param userIds IDs de los usuarios a agregar.
   * @returns La conversación actualizada.
   */
  async addUsersToConversation(conversacionId: string, userIds: string[]): Promise<Conversacion> {
    const conversacion = await this.findOne(conversacionId);

    const existingUserIds = conversacion.user_ids.map(user => user.id);
    const newUserIds = userIds.filter(id => !existingUserIds.includes(id));

    if (newUserIds.length === 0) {
      throw new ConflictException('Todos los usuarios ya son miembros de la conversación.');
    }

    conversacion.user_ids.push(...newUserIds.map(id => ({ id })));
    return this.conversacionRepository.save(conversacion);
  }
}
