import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Foro } from './entities/foro.entity';


@Injectable()
export class ForosService {
  constructor(
    @InjectRepository(Foro)
    private foroRepository: Repository<Foro>,
  ) {}

  async createForo(nombre: string, descripcion: string): Promise<Foro> {
    const newForo = this.foroRepository.create({ nombre, descripcion });
    return this.foroRepository.save(newForo);
  }

  async getAllForos(): Promise<Foro[]> {
    return this.foroRepository.find();
  }

  async getForoById(foroId: string): Promise<Foro> {
    const foro = await this.foroRepository.findOne({ where: { foro_id: foroId } });
    if (!foro) {
      throw new NotFoundException('Foro no encontrado');
    }
    return foro;
  }
}
