import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateLogroDto } from './dto/create-logro.dto';
import { Logro } from './entities/logro.entity';

@Injectable()
export class LogrosService {
  constructor(
    @InjectRepository(Logro)
    private logroRepository: Repository<Logro>,
  ) {}

  async createLogro(createLogroDto: CreateLogroDto): Promise<Logro> {
    const newLogro = this.logroRepository.create(createLogroDto);
    return this.logroRepository.save(newLogro);
  }

  async getAllLogros(): Promise<Logro[]> {
    return this.logroRepository.find();
  }

  async getLogrosByUsuarioId(usuarioId: string): Promise<Logro[]> {
    return this.logroRepository.find({ where: { usuario_id: usuarioId } });
  }

  async getLogroById(logroId: string): Promise<Logro> {
    const logro = await this.logroRepository.findOne({ where: { logro_id: logroId } });
    if (!logro) {
      throw new NotFoundException('Logro no encontrado');
    }
    return logro;
  }

  async updateLogro(logroId: string, updateLogroDto: CreateLogroDto): Promise<Logro> {
    await this.logroRepository.update(logroId, updateLogroDto);
    const updatedLogro = await this.logroRepository.findOne({ where: { logro_id: logroId } });
    if (!updatedLogro) {
      throw new NotFoundException('Logro no encontrado');
    }
    return updatedLogro;
  }

  async deleteLogro(logroId: string): Promise<void> {
    const result = await this.logroRepository.delete(logroId);
    if (result.affected === 0) {
      throw new NotFoundException('Logro no encontrado');
    }
  }
}
