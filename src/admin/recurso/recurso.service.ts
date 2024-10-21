import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRecursoDto } from './dto/create-recurso.dto';
import { Recurso } from './entities/recurso.entity';
import { UpdateRecursoDto } from './dto/update-recurso.dto';

@Injectable()
export class RecursosService {
  constructor(
    @InjectRepository(Recurso)
    private recursoRepository: Repository<Recurso>,
  ) {}

  async createRecurso(createRecursoDto: CreateRecursoDto): Promise<Recurso> {
    const newRecurso = this.recursoRepository.create(createRecursoDto);
    return this.recursoRepository.save(newRecurso);
  }

  async updateRecurso(recursoId: string, updateRecursoDto: UpdateRecursoDto): Promise<Recurso> {
    await this.recursoRepository.update(recursoId, updateRecursoDto);
    return this.getRecursoById(recursoId);
  }

  async getAllRecursos(): Promise<Recurso[]> {
    return this.recursoRepository.find();
  }

  async getRecursoById(recursoId: string): Promise<Recurso> {
    const recurso = await this.recursoRepository.findOne({ where: { recurso_id: recursoId } });
    if (!recurso) {
      throw new NotFoundException('Recurso no encontrado');
    }
    return recurso;
  }

  async deleteRecurso(recursoId: string): Promise<void> {
    const result = await this.recursoRepository.delete(recursoId);
    if (result.affected === 0) {
      throw new NotFoundException('Recurso no encontrado');
    }
  }
}

