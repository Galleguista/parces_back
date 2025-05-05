import { Entity, PrimaryColumn, Column } from 'typeorm';
import { Expose } from 'class-transformer';

@Entity({ schema: 'chat', name: 'tipo_conversacion' })
export class TipoConversacion {
  @PrimaryColumn('uuid')
  @Expose({ name: 'conversation_type_id' })
  tipo_conversacion_id: string;

  @Column({ type: 'varchar', length: 50 })
  @Expose({ name: 'name' })
  nombre: string;

  @Column({ type: 'text', nullable: true })
  @Expose({ name: 'description' })
  descripcion?: string;
}
