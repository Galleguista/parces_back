import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Proyecto } from './entities/proyecto.entity';
import { CreateProyectoDto } from './dto/create-proyecto.dto';

@Injectable()
export class ProyectoService {
  constructor(
    @InjectRepository(Proyecto)
    private readonly proyectoRepository: Repository<Proyecto>,
  ) {}

  async create(createProyectoDto: CreateProyectoDto): Promise<Proyecto> {
    const newProyecto = this.proyectoRepository.create(createProyectoDto);
    return this.proyectoRepository.save(newProyecto);
  }

  async findAll(): Promise<Proyecto[]> {
    return this.proyectoRepository.find();
  }

  async findOne(id: string): Promise<Proyecto> {
    const proyecto = await this.proyectoRepository.findOne({ where: { proyecto_id: id } });
    if (!proyecto) throw new NotFoundException(`Proyecto con ID ${id} no encontrado`);
    return proyecto;
  }

  async update(id: string, updateProyectoDto: CreateProyectoDto): Promise<Proyecto> {
    const proyecto = await this.proyectoRepository.preload({
      proyecto_id: id,
      ...updateProyectoDto,
    });
    if (!proyecto) throw new NotFoundException(`Proyecto con ID ${id} no encontrado`);
    return this.proyectoRepository.save(proyecto);
  }

  async remove(id: string): Promise<void> {
    const proyecto = await this.proyectoRepository.findOne({ where: { proyecto_id: id } });
    if (!proyecto) throw new NotFoundException(`Proyecto con ID ${id} no encontrado`);
    await this.proyectoRepository.remove(proyecto);
  }
}
