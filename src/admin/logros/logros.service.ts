// logros.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Logro } from './entities/logro.entity';

@Injectable()
export class LogrosService {
  private predefinedLogros = [
    { id: '1', titulo: 'Primer Proyecto', descripcion: 'Creaste tu primer proyecto.', imagen_url: 'https://via.placeholder.com/300' },
    { id: '2', titulo: 'Contribuidor Top', descripcion: 'Eres el contribuidor top del mes.', imagen_url: 'https://via.placeholder.com/300' },
    // Otros logros predefinidos
  ];

  constructor(
    @InjectRepository(Logro)
    private logroRepository: Repository<Logro>,
  ) {}

  async unlockLogro(usuarioId: string, logroId: string) {
    const predefinedLogro = this.predefinedLogros.find(logro => logro.id === logroId);
    if (predefinedLogro) {
      const newLogro = this.logroRepository.create({ ...predefinedLogro, usuario_id: usuarioId, fecha_obtencion: new Date() });
      await this.logroRepository.save(newLogro);
      return newLogro;
    }
    throw new Error('Logro no encontrado');
  }

  async getLogrosByUsuarioId(usuarioId: string) {
    return this.logroRepository.find({ where: { usuario_id: usuarioId } });
  }
}
