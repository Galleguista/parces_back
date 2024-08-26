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

  async create(createProyectoDto: CreateProyectoDto, imagen_representativa: Express.Multer.File): Promise<Proyecto> {
    const newProyecto = this.proyectoRepository.create({
      ...createProyectoDto,
      imagen_representativa: imagen_representativa ? imagen_representativa.buffer : null,
    });
    return this.proyectoRepository.save(newProyecto);
  }

  async findAll(): Promise<Partial<Proyecto>[]> {
    const proyectos = await this.proyectoRepository.find();
    return proyectos.map(proyecto => {
      const proyectoCopia = { ...proyecto };
      if (proyecto.imagen_representativa) {
        proyectoCopia.imagen_representativa = proyecto.imagen_representativa.toString('base64') as any;
      }
      return proyectoCopia;
    });
  }

  async findOne(id: string): Promise<Partial<Proyecto>> {
    const proyecto = await this.proyectoRepository.findOne({ where: { proyecto_id: id } });
    if (!proyecto) {
      throw new NotFoundException(`Proyecto con ID ${id} no encontrado`);
    }

    const proyectoCopia = { ...proyecto };
    if (proyecto.imagen_representativa) {
      proyectoCopia.imagen_representativa = proyecto.imagen_representativa.toString('base64') as any;
    }

    return proyectoCopia;
  }

  async update(id: string, updateProyectoDto: CreateProyectoDto, imagen_representativa: Express.Multer.File): Promise<Proyecto> {
    const proyecto = await this.proyectoRepository.preload({
      proyecto_id: id,
      ...updateProyectoDto,
      imagen_representativa: imagen_representativa ? imagen_representativa.buffer : undefined,
    });

    if (!proyecto) {
      throw new NotFoundException(`Proyecto con ID ${id} no encontrado`);
    }

    return this.proyectoRepository.save(proyecto);
  }

  async remove(id: string): Promise<void> {
    const proyecto = await this.proyectoRepository.findOne({ where: { proyecto_id: id } });
    if (!proyecto) {
      throw new NotFoundException(`Proyecto con ID ${id} no encontrado`);
    }
    await this.proyectoRepository.remove(proyecto);
  }
}
