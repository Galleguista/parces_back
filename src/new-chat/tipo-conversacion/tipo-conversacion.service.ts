import { Repository } from "typeorm";
import { TipoConversacion } from "./entities/tipo-conversacion.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Injectable } from "@nestjs/common";

@Injectable()
export class TipoConversacionService {
  constructor(
    @InjectRepository(TipoConversacion)
    private readonly tipoConversacionRepository: Repository<TipoConversacion>,
  ) {}

  /**
   * Obtiene todos los tipos de conversación.
   * @returns Lista de tipos de conversación.
   */
  async findAll(): Promise<TipoConversacion[]> {
    return await this.tipoConversacionRepository.find();
  }

  /**
   * Obtiene un tipo de conversación por ID.
   * @param tipo_conversacion_id ID del tipo de conversación.
   * @returns Tipo de conversación encontrado.
   */
  async findById(tipo_conversacion_id: string): Promise<TipoConversacion | null> {
    return await this.tipoConversacionRepository.findOne({ where: { tipo_conversacion_id } });
  }
}
