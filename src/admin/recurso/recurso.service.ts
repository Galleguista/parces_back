import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRecursoDto } from './dto/create-recurso.dto';
import { UpdateRecursoDto } from './dto/update-recurso.dto'; // Importar el DTO de actualización
import { Recurso } from './entities/recurso.entity';
import { FilesService } from 'src/system/files/files.service'; // Importar el servicio de archivos

@Injectable()
export class RecursosService {
  constructor(
    @InjectRepository(Recurso)
    private recursoRepository: Repository<Recurso>,
    private readonly filesService: FilesService, // Inyectar el servicio de archivos
  ) {}

  async createRecurso(createRecursoDto: CreateRecursoDto): Promise<Recurso> {
    const newRecurso = this.recursoRepository.create(createRecursoDto);
    return this.recursoRepository.save(newRecurso);
  }

  async handleFileUploads(files: any, req: any, createRecursoDto: CreateRecursoDto): Promise<Recurso> {
    let imagenUrl = null;
    let pdfUrl = null;

    // Manejar la imagen si existe
    if (files.imagen && files.imagen[0]) {
      const imagen = files.imagen[0];
      const relativePath = (await this.filesService.handleFileUpload(imagen, req)).relativePath;
      imagenUrl = this.filesService.getFileUrl(relativePath); // Armar la URL completa
    }

    // Manejar el PDF si existe
    if (files.pdf && files.pdf[0]) {
      const pdf = files.pdf[0];
      const relativePath = (await this.filesService.handleFileUpload(pdf, req)).relativePath;
      pdfUrl = this.filesService.getFileUrl(relativePath); // Armar la URL completa
    }

    // Crear el recurso con las URLs generadas
    return this.createRecurso({
      ...createRecursoDto,
      imagen_url: imagenUrl,
      pdf_url: pdfUrl,
    });
  }

  async updateRecurso(recursoId: string, updateRecursoDto: UpdateRecursoDto, files: any, req: any): Promise<Recurso> {
    const recurso = await this.recursoRepository.findOne({ where: { recurso_id: recursoId } });

    if (!recurso) {
      throw new NotFoundException('Recurso no encontrado');
    }

    // Si se sube una nueva imagen, manejar la subida y actualización de la URL
    if (files.imagen && files.imagen[0]) {
      const imagen = files.imagen[0];
      const relativePath = (await this.filesService.handleFileUpload(imagen, req)).relativePath;
      updateRecursoDto.imagen_url = this.filesService.getFileUrl(relativePath); // Armar la URL completa
    }

    // Si se sube un nuevo PDF, manejar la subida y actualización de la URL
    if (files.pdf && files.pdf[0]) {
      const pdf = files.pdf[0];
      const relativePath = (await this.filesService.handleFileUpload(pdf, req)).relativePath;
      updateRecursoDto.pdf_url = this.filesService.getFileUrl(relativePath); // Armar la URL completa
    }

    // Actualizar el recurso con las nuevas propiedades
    Object.assign(recurso, updateRecursoDto);

    return this.recursoRepository.save(recurso);
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
