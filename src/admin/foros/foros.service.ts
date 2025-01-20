import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Foro } from './entities/foro.entity';
import { Conversacion } from 'src/new-chat/conversacion/entities/conversacion.entity';

@Injectable()
export class ForosService {
  constructor(
    @InjectRepository(Foro)
    private foroRepository: Repository<Foro>,
    @InjectRepository(Conversacion)
    private conversacionRepository: Repository<Conversacion>,
  ) {}

  async createForo(nombre: string, descripcion: string): Promise<Foro> {
    const nuevaConversacion = this.conversacionRepository.create({
      tipo_conversacion_id: '8e31f056-40a8-4879-bb13-8b210e8f8a78',
      user_ids: [],
      fecha_creacion: new Date(),
    });
    const savedConversacion = await this.conversacionRepository.save(nuevaConversacion);

    
    const newForo = this.foroRepository.create({
      nombre,
      descripcion,
      conversacion_id: savedConversacion.conversacion_id,
    });

    return this.foroRepository.save(newForo);
  }

  // Obtener todos los foros
  async getAllForos(): Promise<Foro[]> {
    return this.foroRepository.find();
  }

  // Obtener un foro por ID
  async getForoById(foroId: string): Promise<Foro> {
    const foro = await this.foroRepository.findOne({ where: { foro_id: foroId } });
    if (!foro) throw new NotFoundException('Foro no encontrado');
    return foro;
  }

  async joinForo(foroId: string, usuarioId: string): Promise<Conversacion> {
    const foro = await this.foroRepository.findOne({ where: { foro_id: foroId } });
  
    if (!foro) {
      throw new NotFoundException('Foro no encontrado.');
    }
  
    const conversacion = await this.conversacionRepository.findOne({
      where: { conversacion_id: foro.conversacion_id },
    });
  
    if (!conversacion) {
      throw new NotFoundException('Conversación asociada al foro no encontrada.');
    }
  
    const isAlreadyMember = conversacion.user_ids.some((user) => user.id === usuarioId);
  
    if (isAlreadyMember) {
      throw new ConflictException('El usuario ya es miembro de este foro.');
    }
  
    conversacion.user_ids.push({ id: usuarioId });
    return this.conversacionRepository.save(conversacion);
  }
  
}
