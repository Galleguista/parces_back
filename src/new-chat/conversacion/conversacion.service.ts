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
   * @param createConversacionDto Datos de la conversación a crear.
   * @returns La conversación creada.
   */
  async create(createConversacionDto: CreateConversacionDto): Promise<Conversacion> {
    const conversacion = this.conversacionRepository.create(createConversacionDto);
    return await this.conversacionRepository.save(conversacion);
  }

  /**
   * Crea o recupera una conversación privada entre dos usuarios.
   * @param currentUserId ID del usuario autenticado.
   * @param memberId ID del usuario con el que se desea iniciar la conversación.
   * @returns La conversación privada existente o una nueva si no existe.
   */
  async createOrGetPrivateChat(
    currentUserId: string,
    memberId: string,
  ): Promise<Conversacion> {
    // Formatea `user_ids` como JSON para la consulta
    const userIdsJson = JSON.stringify([{ id: currentUserId }, { id: memberId }]);

    console.log('Verificando conversación privada entre:', currentUserId, 'y', memberId);

    // Verifica si ya existe una conversación privada entre los dos usuarios
    let conversacion = await this.conversacionRepository
      .createQueryBuilder('conversacion')
      .where(`conversacion.tipo_conversacion_id = :tipoId`, { tipoId: '7c4fc440-7281-40d3-a96e-303e2bb8cd84' }) // ID del tipo de conversación privada
      .andWhere(`conversacion.user_ids @> :userIds1`, { userIds1: userIdsJson })
      .orWhere(`conversacion.user_ids @> :userIds2`, { userIds2: JSON.stringify([{ id: memberId }, { id: currentUserId }]) })
      .getOne();

    if (conversacion) {
      console.log('Conversación privada existente encontrada. conversacion_id:', conversacion.conversacion_id);
    } else {
      console.log('No existe conversación previa, creando nueva conversación privada.');
      // Crear una nueva conversación si no existe una previa
      const nuevaConversacion = this.conversacionRepository.create({
        tipo_conversacion_id: '7c4fc440-7281-40d3-a96e-303e2bb8cd84', // ID del tipo de conversación privada
        user_ids: [{ id: currentUserId }, { id: memberId }],
        fecha_creacion: new Date(),
      });

      conversacion = await this.conversacionRepository.save(nuevaConversacion);
      console.log('Nueva conversación creada. conversacion_id:', conversacion.conversacion_id);
    }

    return conversacion;
  }
  

  async findAll(): Promise<Conversacion[]> {
    return await this.conversacionRepository.find();
  }

  async findOne(id: string): Promise<Conversacion> {
    const conversacion = await this.conversacionRepository.findOne({ where: { conversacion_id: id } });
    if (!conversacion) throw new NotFoundException(`No se encontró la conversación con ID ${id}`);
    return conversacion;
  }

  async addUsersToConversation(conversacionId: string, userIds: string[]): Promise<Conversacion> {
    const conversacion = await this.conversacionRepository.findOne({
      where: { conversacion_id: conversacionId },
    });
  
    if (!conversacion) {
      throw new NotFoundException(`Conversación con ID ${conversacionId} no encontrada.`);
    }
  
    const existingUserIds = conversacion.user_ids.map((user) => user.id);
    const newUserIds = userIds.filter((id) => !existingUserIds.includes(id));
  
    if (newUserIds.length === 0) {
      throw new ConflictException('Todos los usuarios ya son miembros de la conversación.');
    }
  
    conversacion.user_ids.push(...newUserIds.map((id) => ({ id })));
    return this.conversacionRepository.save(conversacion);
  }
  

  /**
   * Verifica si un usuario es miembro de una conversación.
   * @param conversacionId ID de la conversación.
   * @param userId ID del usuario.
   * @returns `true` si el usuario es miembro de la conversación, `false` en caso contrario.
   */
  async isUserMember(conversacionId: string, userId: string): Promise<boolean> {
    const conversacion = await this.findOne(conversacionId);
    const members = conversacion.user_ids.map((member) => member.id);
    return members.includes(userId);
  }
}
