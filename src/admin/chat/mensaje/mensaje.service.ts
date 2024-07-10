import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Mensaje } from './entities/mensaje.entity';
import { CreateMensajeDto } from './dto/create-mensaje.dto';

@Injectable()
export class MensajeService {
  constructor(
    @InjectRepository(Mensaje)
    private mensajeRepository: Repository<Mensaje>,
  ) {}

  async createMensaje(createMensajeDto: CreateMensajeDto): Promise<Mensaje> {
    const newMensaje = this.mensajeRepository.create(createMensajeDto);
    return this.mensajeRepository.save(newMensaje);
  }

  async getMensajes(chatId: string): Promise<Mensaje[]> {
    return this.mensajeRepository.find({
      where: { chat_id: chatId },
      order: { fecha_envio: 'ASC' },
    });
  }
}
 