import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRecursoDto } from './dto/create-recurso.dto';
import { UpdateRecursoDto } from './dto/update-recurso.dto';
import { Recurso } from './entities/recurso.entity';
import { FilesService } from 'src/system/files/files.service'; // Importar el servicio de archivos

@Injectable()
export class RecursosService {
  constructor(
    @InjectRepository(Recurso)
    private recursoRepository: Repository<Recurso>,
    private readonly filesService: FilesService, // Inyectar el servicio de archivos
  ) {}

  // Crear un recurso con imagen y/o PDF
  async createRecurso(createRecursoDto: CreateRecursoDto, files: any, req: any): Promise<Recurso> {
    let imagen_url = '';
    let pdf_url = '';

    // Procesar la imagen si existe
    if (files.imagen && files.imagen[0]) {
      const relativePath = await this.filesService.handleFileUpload(files.imagen[0], req);
      imagen_url = relativePath.relativePath; // Ruta relativa devuelta por el FilesService
    }

    // Procesar el PDF si existe
    if (files.pdf && files.pdf[0]) {
      const relativePath = await this.filesService.handleFileUpload(files.pdf[0], req);
      pdf_url = relativePath.relativePath; // Ruta relativa devuelta por el FilesService
    }

    // Crear el nuevo recurso con las URLs configuradas correctamente
    const newRecurso = this.recursoRepository.create({
      ...createRecursoDto,
      imagen_url,
      pdf_url,
    });

    // Guardar el recurso en la base de datos
    return await this.recursoRepository.save(newRecurso);
  }

  // Actualizar un recurso con una nueva imagen o PDF
  async updateRecurso(recursoId: string, updateRecursoDto: UpdateRecursoDto, files: any, req: any): Promise<Recurso> {
    const recurso = await this.recursoRepository.findOne({ where: { recurso_id: recursoId } });

    if (!recurso) {
      throw new NotFoundException('Recurso no encontrado');
    }

    // Actualizar la imagen si hay una nueva
    if (files.imagen && files.imagen[0]) {
      const relativePath = await this.filesService.handleFileUpload(files.imagen[0], req);
      updateRecursoDto.imagen_url = relativePath.relativePath;
    }

    // Actualizar el PDF si hay uno nuevo
    if (files.pdf && files.pdf[0]) {
      const relativePath = await this.filesService.handleFileUpload(files.pdf[0], req);
      updateRecursoDto.pdf_url = relativePath.relativePath;
    }

    // Actualizar el recurso con los nuevos datos
    Object.assign(recurso, updateRecursoDto);

    // Guardar el recurso actualizado en la base de datos
    return await this.recursoRepository.save(recurso);
  }

  // Obtener un recurso por ID
  async getRecursoById(recursoId: string): Promise<Recurso> {
    const recurso = await this.recursoRepository.findOne({ where: { recurso_id: recursoId } });

    if (!recurso) {
      throw new NotFoundException('Recurso no encontrado');
    }

    return recurso;
  }

  // Obtener todos los recursos
  async getAllRecursos(): Promise<Recurso[]> {
    return await this.recursoRepository.find();
  }

  // Eliminar un recurso por ID
  async deleteRecurso(recursoId: string): Promise<void> {
    const result = await this.recursoRepository.delete(recursoId);
    if (result.affected === 0) {
      throw new NotFoundException('Recurso no encontrado');
    }
  }
}
