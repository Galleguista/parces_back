import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Proyecto } from './entities/proyecto.entity';
import { CreateProyectoDto } from './dto/create-proyecto.dto';
import { UpdateProyectoDto } from './dto/update-proyecto.dto';
import { Conversacion } from 'src/new-chat/conversacion/entities/conversacion.entity';
import { Usuario } from 'src/users/entity/usuario.entity';
import { Bitacora } from './bitacora/entities/bitacora.entity';

@Injectable()
export class ProyectoService {
  constructor(
    @InjectRepository(Proyecto)
    private readonly proyectoRepository: Repository<Proyecto>,
    @InjectRepository(Conversacion)
    private readonly conversacionRepository: Repository<Conversacion>,
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    @InjectRepository(Bitacora)
    private readonly bitacoraRepository: Repository<Bitacora>,
  ) {}

  async create(createProyectoDto: CreateProyectoDto, usuario_id: string): Promise<Proyecto> {
    const conversacion = this.conversacionRepository.create({
      user_ids: [{ id: usuario_id }],
      tipo_conversacion_id: '98f5aa78-9a20-4386-b08c-f6e6fe44069b',
      fecha_creacion: new Date(),
    });
    const savedConversacion = await this.conversacionRepository.save(conversacion);

    const newProyecto = this.proyectoRepository.create({
      ...createProyectoDto,
      usuario_id,
      conversacion_id: savedConversacion.conversacion_id,
    });

    return this.proyectoRepository.save(newProyecto);
  }

  async findAll(): Promise<Proyecto[]> {
    return this.proyectoRepository.find();
  }

  async getMembersWithAdmin(proyecto_id: string) {
    const proyecto = await this.proyectoRepository.findOne({ where: { proyecto_id } });
    if (!proyecto) throw new NotFoundException(`Proyecto con ID ${proyecto_id} no encontrado.`);

    const conversacion = await this.conversacionRepository.findOne({ where: { conversacion_id: proyecto.conversacion_id } });
    if (!conversacion) throw new NotFoundException(`Conversación para el proyecto con ID ${proyecto_id} no encontrada.`);

    const userIds = conversacion.user_ids.map((user) => user.id);
    const miembros = await this.usuarioRepository.find({
      where: { usuario_id: In(userIds) },
      select: ['usuario_id', 'nombre', 'avatar'],
    });

    const administrador = await this.usuarioRepository.findOne({
      where: { usuario_id: proyecto.usuario_id },
      select: ['usuario_id', 'nombre', 'avatar'],
    });

    return { administrador, miembros };
  }

  async getMember(proyecto_id: string, usuario_id: string) {
    const proyecto = await this.findOne(proyecto_id);

    const conversacion = await this.conversacionRepository.findOne({
      where: { conversacion_id: proyecto.conversacion_id },
    });
    if (!conversacion) throw new NotFoundException(`Conversación para el proyecto no encontrada.`);

    const miembro = conversacion.user_ids.find(user => user.id === usuario_id);
    if (!miembro) throw new NotFoundException(`El usuario con ID ${usuario_id} no es miembro del proyecto.`);

    return this.usuarioRepository.findOne({
      where: { usuario_id },
      select: ['usuario_id', 'nombre', 'avatar'],
    });
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
    const proyecto = await this.findOne(proyecto_id);

    if (proyecto.usuario_id !== admin_id) {
      throw new ForbiddenException('No tienes permisos para añadir miembros a este proyecto.');
    }

    const conversacion = await this.conversacionRepository.findOne({
      where: { conversacion_id: proyecto.conversacion_id },
    });

    if (!conversacion) {
      throw new NotFoundException(`No se encontró la conversación para el proyecto con ID ${proyecto_id}`);
    }

    const isAlreadyMember = conversacion.user_ids.some(user => user.id === usuario_id);
    if (isAlreadyMember) {
      throw new ConflictException('El usuario ya es miembro del proyecto.');
    }

    conversacion.user_ids.push({ id: usuario_id });
    await this.conversacionRepository.save(conversacion);

    return conversacion;
  }

  async updateMember(
    proyecto_id: string,
    usuario_id: string,
    updateData: any,
    admin_id: string,
  ) {
    const proyecto = await this.findOne(proyecto_id);

    if (proyecto.usuario_id !== admin_id) {
      throw new ForbiddenException('Solo el administrador puede actualizar miembros.');
    }

    const conversacion = await this.conversacionRepository.findOne({
      where: { conversacion_id: proyecto.conversacion_id },
    });
    if (!conversacion) throw new NotFoundException(`Conversación para el proyecto no encontrada.`);

    const miembro = conversacion.user_ids.find(user => user.id === usuario_id);
    if (!miembro) throw new NotFoundException(`El usuario con ID ${usuario_id} no es miembro del proyecto.`);

    Object.assign(miembro, updateData);

    await this.conversacionRepository.save(conversacion);

    return miembro;
  }

  async removeMember(proyecto_id: string, usuario_id: string, admin_id: string) {
    const proyecto = await this.findOne(proyecto_id);

    if (proyecto.usuario_id !== admin_id) {
      throw new ForbiddenException('Solo el administrador puede eliminar miembros.');
    }

    const conversacion = await this.conversacionRepository.findOne({
      where: { conversacion_id: proyecto.conversacion_id },
    });
    if (!conversacion) throw new NotFoundException(`Conversación para el proyecto no encontrada.`);

    const index = conversacion.user_ids.findIndex(user => user.id === usuario_id);
    if (index === -1) throw new NotFoundException(`El usuario con ID ${usuario_id} no es miembro del proyecto.`);

    conversacion.user_ids.splice(index, 1);
    await this.conversacionRepository.save(conversacion);

    return { message: `Usuario con ID ${usuario_id} eliminado del proyecto.` };
  }

  async findOne(id: string): Promise<Proyecto> {
    const proyecto = await this.proyectoRepository.findOne({ where: { proyecto_id: id } });
    if (!proyecto) throw new NotFoundException(`Proyecto con ID ${id} no encontrado`);
    return proyecto;
  }

  async addBitacora(proyecto_id: string, descripcion: string, complemento?: any): Promise<Bitacora> {
    const bitacora = this.bitacoraRepository.create({ proyecto_id, descripcion, complemento });
    return this.bitacoraRepository.save(bitacora);
  }

  async getBitacoras(proyecto_id: string): Promise<Bitacora[]> {
    const bitacoras = await this.bitacoraRepository.find({
      where: { proyecto_id },
      order: { fecha: 'ASC' },
    });
    return bitacoras; 
  }
  
  async remove(id: string): Promise<void> {
    const proyecto = await this.proyectoRepository.findOne({ where: { proyecto_id: id } });
    if (!proyecto) throw new NotFoundException(`Proyecto con ID ${id} no encontrado`);
    await this.proyectoRepository.remove(proyecto);
  }
}
