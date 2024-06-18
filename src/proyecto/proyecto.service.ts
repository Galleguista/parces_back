import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Proyecto } from './entities/proyecto.entity';
import { CreateProyectoDto } from './dto/create-proyecto.dto';

@Injectable()
export class ProyectoService {
  constructor(
    @InjectRepository(Proyecto)
    private proyectoRepository: Repository<Proyecto>,
  ) {}

  async createProyecto(createProyectoDto: CreateProyectoDto): Promise<Proyecto> {
    const newProyecto = this.proyectoRepository.create(createProyectoDto);
    return this.proyectoRepository.save(newProyecto);
  }
}
