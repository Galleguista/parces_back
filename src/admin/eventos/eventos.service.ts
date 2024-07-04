import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateEventoDto } from './dto/create-evento.dto';
import { Evento } from './entities/evento.entity';

@Injectable()
export class EventosService {
  constructor(
    @InjectRepository(Evento)
    private eventoRepository: Repository<Evento>,
  ) {}

  async createEvento(createEventoDto: CreateEventoDto): Promise<Evento> {
    const newEvento = this.eventoRepository.create(createEventoDto);
    return this.eventoRepository.save(newEvento);
  }

  async getAllEventos(): Promise<Evento[]> {
    return this.eventoRepository.find();
  }

  async getEventoById(eventoId: string): Promise<Evento> {
    const evento = await this.eventoRepository.findOne({ where: { evento_id: eventoId } });
    if (!evento) {
      throw new NotFoundException('Evento no encontrado');
    }
    return evento;
  }

  async deleteEvento(eventoId: string): Promise<void> {
    const result = await this.eventoRepository.delete(eventoId);
    if (result.affected === 0) {
      throw new NotFoundException('Evento no encontrado');
    }
  }
}
