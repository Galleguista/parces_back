import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Proyecto } from './entities/proyecto.entity';
import { CreateProyectoDto } from './dto/create-proyecto.dto';
import { UpdateProyectoDto } from './dto/update-proyecto.dto';
import { Conversacion } from 'src/new-chat/conversacion/entities/conversacion.entity';
import { Usuario } from 'src/users/entity/usuario.entity';

@Injectable()
export class ProyectoService {
  constructor(
    @InjectRepository(Proyecto)
    private readonly proyectoRepository: Repository<Proyecto>,
    @InjectRepository(Conversacion)
    private readonly conversacionRepository: Repository<Conversacion>,
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
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

  async getMembersOfProyecto(proyecto_id: string) {
    // Buscar el proyecto
    const proyecto = await this.proyectoRepository.findOne({ where: { proyecto_id } });
    if (!proyecto) {
      throw new NotFoundException(`No se encontró el proyecto con ID ${proyecto_id}`);
    }

    // Obtener la conversación asociada
    const conversacion = await this.conversacionRepository.findOne({
      where: { conversacion_id: proyecto.conversacion_id },
    });
    if (!conversacion) {
      throw new NotFoundException(`No se encontró la conversación para el proyecto con ID ${proyecto_id}`);
    }

    // Obtener los IDs de usuario
    const userIds = conversacion.user_ids.map((user) => user.id);

    // Buscar usuarios en base a los IDs
    const usuarios = await this.usuarioRepository.findByIds(userIds);

    const usuariosOrdenados = usuarios.sort((a, b) =>
      a.nombre.localeCompare(b.nombre)
    );

    return usuariosOrdenados;
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

  async addMember(proyecto_id: string, usuario_id: string, admin_id: string) {
    // Busca el proyecto
    const proyecto = await this.findOne(proyecto_id);
  
    // Validar si el usuario autenticado es el administrador
    if (proyecto.usuario_id !== admin_id) {
      throw new ForbiddenException('No tienes permisos para añadir miembros a este proyecto.');
    }
  
    // Busca la conversación asociada
    const conversacion = await this.conversacionRepository.findOne({
      where: { conversacion_id: proyecto.conversacion_id },
    });
  
    if (!conversacion) {
      throw new NotFoundException(`No se encontró la conversación para el proyecto con ID ${proyecto_id}`);
    }
  
    // Verifica si el usuario ya es miembro
    const isAlreadyMember = conversacion.user_ids.some(user => user.id === usuario_id);
    if (isAlreadyMember) {
      throw new ConflictException('El usuario ya es miembro del proyecto.');
    }
  
    // Añade el nuevo usuario
    conversacion.user_ids.push({ id: usuario_id });
    await this.conversacionRepository.save(conversacion);
  
    return conversacion;
  }
  
  

  async remove(id: string): Promise<void> {
    const proyecto = await this.proyectoRepository.findOne({ where: { proyecto_id: id } });
    if (!proyecto) throw new NotFoundException(`Proyecto con ID ${id} no encontrado`);
    await this.proyectoRepository.remove(proyecto);
  }
}
