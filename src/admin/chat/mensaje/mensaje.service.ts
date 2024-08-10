import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Mensaje } from './entities/mensaje.entity';
import { CreateMensajeDto } from './dto/create-mensaje.dto';
import { GrupoMiembro } from 'src/admin/grupos/entities/grupo-miembro.entity';

@Injectable()
export class MensajeService {
  constructor(
    @InjectRepository(Mensaje)
    private mensajeRepository: Repository<Mensaje>,
    @InjectRepository(GrupoMiembro)
    private grupoMiembroRepository: Repository<GrupoMiembro>,
  ) {}

  async createMensaje(createMensajeDto: CreateMensajeDto): Promise<Mensaje> {
    console.log('Creating single message:', createMensajeDto);  // Añadir log
    if (!createMensajeDto.usuario_id) {
      throw new Error('usuario_id es nulo o indefinido');
    }

    const newMensaje = this.mensajeRepository.create(createMensajeDto);
    return this.mensajeRepository.save(newMensaje);
  }

  async createGroupMensaje(createMensajeDto: CreateMensajeDto): Promise<Mensaje[]> {
    console.log('Creating group message:', createMensajeDto);  // Añadir log
    if (!createMensajeDto.usuario_id) {
      throw new Error('usuario_id es nulo o indefinido');
    }

    const newMensajes: Mensaje[] = [];
    const grupoMiembros = await this.grupoMiembroRepository.find({
      where: { grupo_id: createMensajeDto.chat_id },
    });

    for (const miembro of grupoMiembros) {
      const newMensaje = this.mensajeRepository.create({
        ...createMensajeDto,
        usuario_id: miembro.usuario_id,
      });
      newMensajes.push(await this.mensajeRepository.save(newMensaje));
    }

    return newMensajes;
  }

  async getMensajes(chatId: string): Promise<Mensaje[]> {
    return this.mensajeRepository.find({
      where: { chat_id: chatId },
      order: { fecha_envio: 'ASC' },
    });
  }
}
