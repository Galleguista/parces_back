import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Mensaje } from './entities/mensaje.entity';
import { CreateMensajeDto } from './dto/create-mensaje.dto';
import { MensajeGateway } from './mensaje.gateway';

@Injectable()
export class MensajeService {
  constructor(
    @InjectRepository(Mensaje)
    private readonly mensajeRepository: Repository<Mensaje>,
    private readonly mensajeGateway: MensajeGateway,
  ) {}

  /**
   * Crea un nuevo mensaje en la base de datos.
   * @param createMensajeDto Datos del mensaje.
   * @param usuario_id ID del usuario autenticado.
   * @returns Mensaje creado.
   */
  async create(createMensajeDto: CreateMensajeDto, usuario_id: string): Promise<Mensaje> {
    const mensaje = this.mensajeRepository.create({
      ...createMensajeDto,
      usuario_id,
      fecha_envio: new Date(),
    });
    const savedMensaje = await this.mensajeRepository.save(mensaje);

    // Emitir el mensaje nuevo a través del WebSocket
    this.mensajeGateway.emitNewMessage(createMensajeDto.conversacion_id, {
      mensaje_id: savedMensaje.mensaje_id,
      contenido: savedMensaje.contenido,
      fecha_envio: savedMensaje.fecha_envio,
      usuario_id: savedMensaje.usuario_id,
    });

    return savedMensaje;
  }

  /**
   * Obtiene todos los mensajes de una conversación con datos enriquecidos del usuario.
   * @param conversacion_id ID de la conversación.
   * @returns Lista de mensajes enriquecidos con información del usuario.
   */
  async findAllByConversacion(conversacion_id: string): Promise<any[]> {
    const mensajes = await this.mensajeRepository
      .createQueryBuilder('mensaje')
      .where('mensaje.conversacion_id = :conversacion_id', { conversacion_id })
      .leftJoinAndSelect('usuario', 'u', 'u.usuario_id = mensaje.usuario_id')
      .orderBy('mensaje.fecha_envio', 'ASC')
      .select([
        'mensaje.mensaje_id',
        'mensaje.contenido',
        'mensaje.fecha_envio',
        'mensaje.usuario_id',
        'u.nombre',
        'u.avatar',
      ])
      .getRawMany();

    return mensajes.map((mensaje) => ({
      mensaje_id: mensaje.mensaje_mensaje_id,
      contenido: mensaje.mensaje_contenido,
      fecha_envio: mensaje.mensaje_fecha_envio,
      usuario: {
        usuario_id: mensaje.mensaje_usuario_id,
        nombre: mensaje.u_nombre || 'Usuario desconocido',
        avatar: mensaje.u_avatar || null,
      },
    }));
  }
}
