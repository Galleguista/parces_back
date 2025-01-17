import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notificacion } from './entities/notificacione.entity';

@Injectable()
export class NotificacionesService {
  constructor(
    @InjectRepository(Notificacion)
    private readonly notificacionesRepository: Repository<Notificacion>,
  ) {}

  async crearNotificacion(usuarioId: string, mensaje: string, tipo: string = 'info'): Promise<Notificacion> {
    const notificacion = this.notificacionesRepository.create({
      usuario_id: usuarioId,
      mensaje,
      tipo,
    });
    return await this.notificacionesRepository.save(notificacion);
  }

  async obtenerNotificacionesPorUsuario(usuarioId: string): Promise<Notificacion[]> {
    return await this.notificacionesRepository.find({
      where: { usuario_id: usuarioId },
      order: { fecha_creacion: 'DESC' },
    });
  }

  async eliminarNotificacion(notificacionId: string): Promise<string> {
    const notificacion = await this.notificacionesRepository.findOne({ where: { notificacion_id: notificacionId } });
    if (!notificacion) {
      throw new Error('Notificación no encontrada');
    }

    await this.notificacionesRepository.delete(notificacionId);
    return 'Notificación eliminada con éxito';
  }
}
