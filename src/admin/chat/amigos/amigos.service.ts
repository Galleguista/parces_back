import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Amigo } from './entities/amigo.entity';

@Injectable()
export class AmigosService {
  constructor(
    @InjectRepository(Amigo)
    private amigoRepository: Repository<Amigo>,
  ) {}

  async addAmigo(usuarioId: string, amigoId: string): Promise<Amigo> {
    const newAmigo = this.amigoRepository.create({ usuario_id: usuarioId, amigo_id: amigoId });
    return this.amigoRepository.save(newAmigo);
  }

  async getAmigos(usuarioId: string): Promise<Amigo[]> {
    return this.amigoRepository.find({ where: { usuario_id: usuarioId }, relations: ['amigo'] });
  }
}
