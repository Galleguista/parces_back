import { ConflictException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Proyecto } from './entities/proyecto.entity';
import { CreateProyectoDto } from './dto/create-proyecto.dto';
import { UpdateProyectoDto } from './dto/update-proyecto.dto';
import { Conversacion } from 'src/new-chat/conversacion/entities/conversacion.entity';
import { Usuario } from 'src/users/entity/usuario.entity';
import { Bitacora } from './bitacora/entities/bitacora.entity';
import { Formulario } from './administracion/formularios/entities/formulario.entity';
import { Postulaciones } from './administracion/postulaciones/entities/postulacione.entity';
import { Respuestas } from './administracion/respuestas/entities/respuesta.entity';

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
    @InjectRepository(Formulario)
    private readonly formularioRepository: Repository<Formulario>,
    @InjectRepository(Postulaciones)
    private readonly postulacionesRepository: Repository<Postulaciones>,
    @InjectRepository(Respuestas)
    private readonly respuestasRepository: Repository<Respuestas>,
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

  async crearFormulario(proyectoId: string, preguntas: string[], usuarioId: string) {
    const proyecto = await this.proyectoRepository.findOne({ where: { proyecto_id: proyectoId } });
    if (!proyecto || proyecto.usuario_id !== usuarioId) {
      throw new UnauthorizedException('No tienes permisos para añadir un formulario.');
    }

    const formulario = preguntas.map((pregunta) => ({
      proyecto_id: proyectoId,
      pregunta,
    }));

    return this.formularioRepository.save(formulario);
  }

  async listarPostulaciones(proyectoId: string, usuarioId: string) {
    const proyecto = await this.proyectoRepository.findOne({ where: { proyecto_id: proyectoId } });
    if (!proyecto || proyecto.usuario_id !== usuarioId) {
      throw new UnauthorizedException('No tienes permisos para ver postulaciones.');
    }

    return this.postulacionesRepository.find({
      where: { proyecto_id: proyectoId },
      relations: ['usuario', 'respuestas.formulario'],
    });
  }

  async crearPostulacion(
    projectId: string,
    usuarioId: string,
    respuestas: { pregunta_id: string; respuesta: string }[],
  ) {
    // Verificar si el proyecto existe
    const proyecto = await this.proyectoRepository.findOne({ where: { proyecto_id: projectId } });
    if (!proyecto) {
      throw new NotFoundException(`Proyecto con ID ${projectId} no encontrado.`);
    }
  
    // Verificar si el usuario ya ha postulado
    const yaPostulado = await this.postulacionesRepository.findOne({
      where: { proyecto_id: projectId, usuario_id: usuarioId },
    });
    if (yaPostulado) {
      throw new ConflictException('Ya has enviado una postulación para este proyecto.');
    }
  
    // Crear la nueva postulación
    const nuevaPostulacion = this.postulacionesRepository.create({
      proyecto_id: projectId,
      usuario_id: usuarioId,
      estado: 'pendiente',
    });
    const postulacionGuardada = await this.postulacionesRepository.save(nuevaPostulacion);
  
    // Guardar las respuestas asociadas a la postulación
    for (const respuesta of respuestas) {
      await this.respuestasRepository.save({
        postulacion_id: postulacionGuardada.postulacion_id,
        formulario_id: respuesta.pregunta_id,
        respuesta: respuesta.respuesta,
      });
    }
  
    return {
      mensaje: 'Postulación creada con éxito.',
      postulacionId: postulacionGuardada.postulacion_id,
    };
  }
  

  async cambiarEstadoPostulacion(proyectoId: string, postulacionId: string, estado: string, usuarioId: string) {
    const proyecto = await this.proyectoRepository.findOne({ where: { proyecto_id: proyectoId } });
    if (!proyecto || proyecto.usuario_id !== usuarioId) {
      throw new UnauthorizedException('No tienes permisos para modificar postulaciones.');
    }

    const postulacion = await this.postulacionesRepository.findOne({ where: { postulacion_id: postulacionId } });
    if (!postulacion) {
      throw new NotFoundException('Postulación no encontrada.');
    }

    postulacion.estado = estado;
    return this.postulacionesRepository.save(postulacion);
  }
  
  async getPostulacionesDetalle(projectId: string, usuarioId: string) {
    // Buscar el proyecto
    const proyecto = await this.proyectoRepository.findOne({ where: { proyecto_id: projectId } });
  
    if (!proyecto) {
      throw new NotFoundException(`Proyecto con ID ${projectId} no encontrado.`);
    }
  
    // Determinar si el usuario es propietario del proyecto
    const esPropietario = proyecto.usuario_id === usuarioId;
  
    // Buscar las preguntas del formulario asociado al proyecto
    const preguntas = await this.formularioRepository.find({ where: { proyecto_id: projectId } });
  
    // Caso: Sin preguntas en el formulario
    if (preguntas.length === 0) {
      return esPropietario
        ? {
            esPropietario: true,
            esMiembro: false,
            yaPostulado: false,
            mensaje: 'No hay postulaciones abiertas para este proyecto.',
            formulario: [],
            postulaciones: [],
          }
        : {
            esPropietario: false,
            esMiembro: false,
            yaPostulado: false,
            mensaje: 'Este proyecto no tiene postulaciones disponibles en este momento.',
            formulario: [],
          };
    }
  
    if (esPropietario) {
      // Si es propietario, obtener todas las postulaciones y sus respuestas
      const postulaciones = await this.postulacionesRepository.find({ where: { proyecto_id: projectId } });
  
      const postulacionesConRespuestas = await Promise.all(
        postulaciones.map(async (postulacion) => {
          const respuestas = await this.respuestasRepository.find({ where: { postulacion_id: postulacion.postulacion_id } });
          return {
            ...postulacion,
            respuestas: respuestas.map((respuesta) => ({
              pregunta: preguntas.find((p) => p.formulario_id === respuesta.formulario_id)?.pregunta || '',
              respuesta: respuesta.respuesta,
            })),
          };
        }),
      );
  
      return {
        esPropietario: true,
        esMiembro: false,
        yaPostulado: false,
        mensaje: 'Gestión de postulaciones activas.',
        formulario: preguntas,
        postulaciones: postulacionesConRespuestas,
      };
    }
  
    // Verificar si el usuario ya ha postulado
    const yaPostulado = await this.postulacionesRepository.findOne({ where: { proyecto_id: projectId, usuario_id: usuarioId } });
  
    return {
      esPropietario: false,
      esMiembro: false,
      yaPostulado: !!yaPostulado,
      mensaje: yaPostulado
        ? 'Ya has enviado una postulación para este proyecto.'
        : 'Este proyecto tiene postulaciones abiertas. Completa el formulario para postularte.',
      formulario: preguntas,
    };
  }
  
}
