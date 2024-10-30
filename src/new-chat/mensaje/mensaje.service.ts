import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Mensaje } from './entities/mensaje.entity';
import { CreateMensajeDto } from './dto/create-mensaje.dto';
import { UserService } from 'src/users/users.service';

@Injectable()
export class MensajeService {
  constructor(
    @InjectRepository(Mensaje)
    private readonly mensajeRepository: Repository<Mensaje>,
    private readonly usuarioService: UserService,
  ) {}

  // Crea un nuevo mensaje utilizando el usuario_id del JWT
  async create(createMensajeDto: CreateMensajeDto, usuario_id: string): Promise<Mensaje> {
    const mensaje = this.mensajeRepository.create({
      ...createMensajeDto,
      usuario_id, // Asigna el usuario_id obtenido del JWT
    });
    return await this.mensajeRepository.save(mensaje);
  }

  // Obtiene todos los mensajes de una conversación y agrega información de usuario
  async findAllByConversacion(conversacion_id: string): Promise<any[]> {
    const mensajes = await this.mensajeRepository.find({
      where: { conversacion_id },
      order: { fecha_envio: 'ASC' },
    });

    // Extrae IDs de usuario únicos de los mensajes
    const usuarioIds = [...new Set(mensajes.map((mensaje) => mensaje.usuario_id))];
    // Consulta los detalles de cada usuario
    const usuarios = await this.usuarioService.findUsersByIds(usuarioIds);

    // Retorna los mensajes con la información completa de cada usuario
    return mensajes.map((mensaje) => {
      const usuario = usuarios.find((user) => user.usuario_id === mensaje.usuario_id);
      return {
        mensaje_id: mensaje.mensaje_id,
        contenido: mensaje.contenido,
        fecha_envio: mensaje.fecha_envio,
        usuario: {
          usuario_id: mensaje.usuario_id,
          nombre: usuario ? usuario.nombre : 'Usuario desconocido',
          avatar: usuario ? usuario.avatar : null,
        },
      };
    });
  }
}
