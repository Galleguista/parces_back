import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Mensaje } from './entities/mensaje.entity';

@Injectable()
export class MensajeService {
  constructor(
    @InjectRepository(Mensaje)
    private mensajeRepo: Repository<Mensaje>,
  ) {}

  // Crear un nuevo mensaje
  async enviarMensaje(conversacion_id: string, remitente_id: string, contenido: any): Promise<Mensaje> {
    const nuevoMensaje = this.mensajeRepo.create({
      conversacion_id,  // Usar el ID de la conversación
      remitente_id,  // Usar el ID del remitente
      contenido,
    });

    return this.mensajeRepo.save(nuevoMensaje);
  }

  // Obtener mensajes por conversación
  async obtenerMensajesPorConversacion(conversacion_id: string): Promise<Mensaje[]> {
    return this.mensajeRepo.find({
      where: { conversacion_id },
      order: { mensaje_id: 'ASC' },  // Ordena los mensajes por el ID
    });
  }
}
