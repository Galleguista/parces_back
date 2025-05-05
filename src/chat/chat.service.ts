import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Conversacion } from './entities/conversacion.entity';
import { UsuarioConversacion } from './entities/usuario_conversacion.entity';
import { SendMessageDto } from './dto/send-message.dto';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { v4 as uuidv4 } from 'uuid';
import { Usuario } from 'src/users/entity/usuario.entity';
import { MensajeAdjunto } from './entities/mensaje.entity';
import { Mensaje } from './entities/mensaje_adjunto.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Mensaje, )
    private readonly mensajeRepo: Repository<Mensaje>,

    @InjectRepository(MensajeAdjunto, )
    private readonly adjuntoRepo: Repository<MensajeAdjunto>,

    @InjectRepository(Conversacion, )
    private readonly conversacionRepo: Repository<Conversacion>,

    @InjectRepository(UsuarioConversacion, )
    private readonly usuarioConversacionRepo: Repository<UsuarioConversacion>,

    @InjectRepository(Usuario, )
    private readonly usuarioRepo: Repository<Usuario>,
  ) {}

  async sendMessage(dto: SendMessageDto) {
    const nuevoMensaje = this.mensajeRepo.create({
      mensaje_id: uuidv4(),
      contenido: dto.contenido,
      conversacion_id: dto.conversacion_id,
      usuario_id: dto.usuario_id,
    });

    const mensajeGuardado = await this.mensajeRepo.save(nuevoMensaje);

    if (dto.adjuntos?.length) {
      const adjuntos = dto.adjuntos.map((file) =>
        this.adjuntoRepo.create({
          adjunto_id: uuidv4(),
          mensaje_id: mensajeGuardado.mensaje_id,
          tipo_adjunto: file.tipo,
          url_adjunto: file.url,
        }),
      );
      await this.adjuntoRepo.save(adjuntos);
    }

    return {
      ...mensajeGuardado,
      adjuntos: dto.adjuntos ?? [],
    };
  }

  async createConversation(dto: CreateConversationDto) {
    const nuevaConversacion = this.conversacionRepo.create({
      conversacion_id: uuidv4(),
      tipo_conversacion_id: dto.tipo_conversacion_id,
    });
    const conversacionGuardada = await this.conversacionRepo.save(nuevaConversacion);

    const relaciones = dto.usuario_ids.map((uid) =>
      this.usuarioConversacionRepo.create({
        usuario_conversacion_id: uuidv4(),
        conversacion_id: conversacionGuardada.conversacion_id,
        usuario_id: uid,
      }),
    );
    await this.usuarioConversacionRepo.save(relaciones);

    return conversacionGuardada;
  }

  async getUserConversations(usuario_id: string) {
    return this.usuarioConversacionRepo.find({
      where: { usuario_id },
    });
  }

  async getConversationMessages(conversacion_id: string) {
    return this.mensajeRepo.find({
      where: { conversacion_id },
      order: { fecha_envio: 'ASC' },
    });
  }

  async addUserToConversation(conversacion_id: string, usuario_id: string) {
    const existente = await this.usuarioConversacionRepo.findOne({
      where: { conversacion_id, usuario_id },
    });

    if (!existente) {
      const relacion = this.usuarioConversacionRepo.create({
        usuario_conversacion_id: uuidv4(),
        conversacion_id,
        usuario_id,
      });
      return this.usuarioConversacionRepo.save(relacion);
    }

    return existente; // Ya estaba
  }

  async removeUserFromConversation(conversacion_id: string, usuario_id: string) {
    const relacion = await this.usuarioConversacionRepo.findOne({
      where: { conversacion_id, usuario_id },
    });
    if (relacion) {
      await this.usuarioConversacionRepo.remove(relacion);
    }
  }

  async getUsersFromConversation(conversacion_id: string): Promise<Usuario[]> {
    const relaciones = await this.usuarioConversacionRepo.find({
      where: { conversacion_id },
    });
    const ids = relaciones.map((r) => r.usuario_id);
    return this.usuarioRepo.findBy({ usuario_id: In(ids) });
  }

  async getConversation(conversacion_id: string) {
    return this.conversacionRepo.findOne({ where: { conversacion_id } });
  }
}
