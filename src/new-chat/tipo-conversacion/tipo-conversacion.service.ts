import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TipoConversacion } from './entities/tipo-conversacion.entity';

@Injectable()
export class TipoConversacionService {
    constructor(
        @InjectRepository(TipoConversacion)
        private readonly tipoConversacionRepo: Repository<TipoConversacion>,
    ) {}

    async crearTipoConversacion(descripcion: string): Promise<TipoConversacion> {
        const nuevoTipo = this.tipoConversacionRepo.create({ descripcion });
        return this.tipoConversacionRepo.save(nuevoTipo);
    }

    async obtenerTodosLosTipos(): Promise<TipoConversacion[]> {
        return this.tipoConversacionRepo.find();
    }
}
