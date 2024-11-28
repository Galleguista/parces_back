import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Conversacion } from './entities/conversacion.entity';
import { CreateConversacionDto } from './dto/create-conversacion.dto';
import { TipoConversacionService } from '../tipo-conversacion/tipo-conversacion.service';
import { UserService } from 'src/users/users.service';
import { Grupo } from 'src/admin/grupos/entities/grupo.entity';
import { ProyectoService } from 'src/proyecto/proyecto.service';
import { Proyecto } from 'src/proyecto/entities/proyecto.entity';

@Injectable()
export class ConversacionService {
  constructor(
    @InjectRepository(Conversacion)
    private readonly conversacionRepository: Repository<Conversacion>,
    @InjectRepository(Grupo)
    private readonly grupoRepository: Repository<Grupo>,
    private readonly tipoConversacionService: TipoConversacionService,
    @InjectRepository(Proyecto)
    private readonly proyectoRepository: Repository<Proyecto>,
    private usuarioRepository: UserService,
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
    // Normaliza los IDs de los usuarios
    const userIds = [currentUserId, memberId].sort();
    const userIdsJson = JSON.stringify(userIds.map((id) => ({ id })));
  
    let conversacion = await this.conversacionRepository
      .createQueryBuilder('conversacion')
      .where('conversacion.tipo_conversacion_id = :tipoId', { tipoId: '7c4fc440-7281-40d3-a96e-303e2bb8cd84' })
      .andWhere('conversacion.user_ids @> :userIds', { userIds: userIdsJson })
      .getOne();
  
    // Si no existe, crear una nueva conversación
    if (!conversacion) {
      const nuevaConversacion = this.conversacionRepository.create({
        tipo_conversacion_id: '7c4fc440-7281-40d3-a96e-303e2bb8cd84',
        user_ids: userIds.map((id) => ({ id })),
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

  async getRecentConversations(usuario_id: string) {
    const conversaciones = await this.conversacionRepository
      .createQueryBuilder('conversacion')
      .where('conversacion.user_ids @> :usuario', { usuario: JSON.stringify([{ id: usuario_id }]) })
      .orderBy('conversacion.fecha_creacion', 'DESC')
      .getMany();
  
    return Promise.all(
      conversaciones.map(async (conversacion) => {
        const tipo = await this.tipoConversacionService.findById(conversacion.tipo_conversacion_id);
  
        if (!tipo) {
          return {
            ...conversacion,
            nombre: 'Desconocido',
            avatar: null,
          };
        }
  
        if (tipo.nombre === 'privado') {
          const otroUsuarioId = conversacion.user_ids
            .map((user) => user.id)
            .find((id) => id !== usuario_id);
  
          if (!otroUsuarioId) {
            return {
              ...conversacion,
              nombre: 'Usuario desconocido',
              avatar: null,
            };
          }
  
          const usuario = await this.usuarioRepository.findOne(otroUsuarioId);
          return {
            ...conversacion,
            nombre: usuario?.nombre || 'Usuario desconocido',
            avatar: usuario?.avatar || null, // Aquí se retorna directamente el texto de la URL
          };
        }
  
        if (tipo.nombre === 'grupo') {
          const grupo = await this.grupoRepository.findOne({ where: { conversacion_id: conversacion.conversacion_id } });
          return {
            ...conversacion,
            nombre: grupo?.nombre || 'Grupo sin nombre',
            avatar: null, // Indica que el frontend debe usar el ícono predeterminado
          };
        }

        if (tipo.nombre === 'proyecto') {
          const proyecto = await this.proyectoRepository.findOne({ where: { conversacion_id: conversacion.conversacion_id } });
          return {
            ...conversacion,
            nombre: proyecto?.nombre || 'Proyecto sin nombre',
            avatar: null, // Los proyectos no tienen avatar por defecto
          };
        }
        
  
        return {
          ...conversacion,
          nombre: 'Desconocido',
          avatar: null,
        };
      }),
    );
  }
}
