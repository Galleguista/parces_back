import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Mensaje } from './entities/mensaje.entity';
import { CreateMensajeDto } from './dto/create-mensaje.dto';
import { Usuario } from 'src/users/entity/usuario.entity';

@Injectable()
export class MensajeService {
  constructor(
    @InjectRepository(Mensaje)
    private readonly mensajeRepository: Repository<Mensaje>,
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  async create(createMensajeDto: CreateMensajeDto, usuario_id: string): Promise<Mensaje> {
    const { conversacion_id, contenido } = createMensajeDto;

    const mensaje = this.mensajeRepository.create({
      conversacion_id,
      contenido,
      usuario_id,
      fecha_envio: new Date(),
    });

    return await this.mensajeRepository.save(mensaje);
  }

  async getMessagesByConversation(conversacionId: string) {
    const mensajes = await this.mensajeRepository.find({
      where: { conversacion_id: conversacionId },
      order: { fecha_envio: 'ASC' },
    });

    if (!mensajes || mensajes.length === 0) {
      throw new NotFoundException('No se encontraron mensajes para esta conversación.');
    }

    const usuarioIds = [...new Set(mensajes.map((mensaje) => mensaje.usuario_id))];

    const usuarios = await this.usuarioRepository.findByIds(usuarioIds);

    const usuarioMap = usuarios.reduce((acc, usuario) => {
      acc[usuario.usuario_id] = usuario.nombre;
      return acc;
    }, {});

    return mensajes.map((mensaje) => ({
      ...mensaje,
      nombre_usuario: usuarioMap[mensaje.usuario_id] || 'Usuario desconocido',
    }));
  }
}
