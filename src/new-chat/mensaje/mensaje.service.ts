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

  async create(createMensajeDto: CreateMensajeDto, usuario_id: string): Promise<Mensaje> {
    const { conversacion_id, contenido } = createMensajeDto;

    const mensaje = this.mensajeRepository.create({
      conversacion_id,
      contenido,
      usuario_id,
      fecha_envio: new Date(),
    });

    return await this.mensajeRepository.save(mensaje);
  }

  async findAllByConversacion(conversacion_id: string): Promise<Mensaje[]> {
    return await this.mensajeRepository.find({
      where: { conversacion_id },
      order: { fecha_envio: 'ASC' },
    });
  }
}
