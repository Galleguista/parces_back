import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TipoConversacion } from './entities/tipo-conversacion.entity';

@Injectable()
export class TipoConversacionService {
  constructor(
    @InjectRepository(TipoConversacion)
    private readonly tipoConversacionRepository: Repository<TipoConversacion>,
  ) {}

  async findAll(): Promise<TipoConversacion[]> {
    return await this.tipoConversacionRepository.find();
  }
}
