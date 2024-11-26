import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Mensaje } from './entities/mensaje.entity';
import { CreateMensajeDto } from './dto/create-mensaje.dto';

@Injectable()
export class MensajeService {
  constructor(
    @InjectRepository(Mensaje)
    private readonly mensajeRepository: Repository<Mensaje>,
  ) {}

  /**
   * Crea un nuevo mensaje en la base de datos.
   * @param createMensajeDto Datos del mensaje.
   * @param usuario_id ID del usuario autenticado.
   * @returns Mensaje creado.
   */
  async create(createMensajeDto: CreateMensajeDto, usuario_id: string): Promise<Mensaje> {
    const { conversacion_id, contenido } = createMensajeDto;
  
    if (!conversacion_id) {
      throw new Error('El ID de la conversación no puede ser nulo.');
    }
  
    const mensaje = this.mensajeRepository.create({
      conversacion_id,
      contenido,
      usuario_id,
      fecha_envio: new Date(),
    });
  
    return await this.mensajeRepository.save(mensaje);
  }
  

  /**
   * Obtiene todos los mensajes de una conversación.
   * @param conversacion_id ID de la conversación.
   * @returns Lista de mensajes.
   */
  async findAllByConversacion(conversacion_id: string): Promise<Mensaje[]> {
    return await this.mensajeRepository.find({
      where: { conversacion_id },
      order: { fecha_envio: 'ASC' },
    });
  }
}
