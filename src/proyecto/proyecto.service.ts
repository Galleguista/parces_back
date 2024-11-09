import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Proyecto } from './entities/proyecto.entity';
import { CreateProyectoDto } from './dto/create-proyecto.dto';
import { UpdateProyectoDto } from './dto/update-proyecto.dto';
import { Conversacion } from 'src/new-chat/conversacion/entities/conversacion.entity';

@Injectable()
export class ProyectoService {
  constructor(
    @InjectRepository(Proyecto)
    private readonly proyectoRepository: Repository<Proyecto>,
    @InjectRepository(Conversacion)
    private readonly conversacionRepository: Repository<Conversacion>,
  ) {}

  async create(createProyectoDto: CreateProyectoDto, usuario_id: string): Promise<Proyecto> {
    // Crear la conversación para el proyecto
    const conversacion = this.conversacionRepository.create({
      user_ids: [{ id: usuario_id }], // Inicia la conversación con el usuario creador
      tipo_conversacion_id: '98f5aa78-9a20-4386-b08c-f6e6fe44069b', // Reemplaza con un ID de tipo válido
      fecha_creacion: new Date(),
    });
    const savedConversacion = await this.conversacionRepository.save(conversacion);

    // Crear el proyecto con el conversacion_id asignado
    const newProyecto = this.proyectoRepository.create({
      ...createProyectoDto,
      usuario_id, // Asigna el usuario creador del proyecto
      conversacion_id: savedConversacion.conversacion_id, // Asigna el conversacion_id recién creado
    });

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

  async update(id: string, updateProyectoDto: UpdateProyectoDto): Promise<Proyecto> {
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
