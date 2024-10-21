import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Conversacion } from './entities/conversacion.entity';

@Injectable()
export class ConversacionesService {
    constructor(
        @InjectRepository(Conversacion)
        private readonly conversacionRepo: Repository<Conversacion>,
    ) {}

    async crearConversacion(tipo_conversacion_id: string, grupo_id?: string): Promise<Conversacion> {
        const nuevaConversacion = this.conversacionRepo.create({ tipo_conversacion: { tipo_conversacion_id }, grupo: grupo_id ? { grupo_id } : null });
        return this.conversacionRepo.save(nuevaConversacion);
    }

    async obtenerConversacionesPorGrupo(grupo_id: string): Promise<Conversacion[]> {
        return this.conversacionRepo.find({
            where: { grupo: { grupo_id } }, 
        });
    }
}
