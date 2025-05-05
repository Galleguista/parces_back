import { Entity, PrimaryColumn, Column, CreateDateColumn } from 'typeorm';
import { Expose } from 'class-transformer';

@Entity({ schema: 'chat', name: 'conversaciones' })
export class Conversacion {
  @PrimaryColumn('uuid')
  @Expose({ name: 'conversation_id' })
  conversacion_id: string;

  @Column('uuid')
  @Expose({ name: 'conversation_type_id' })
  tipo_conversacion_id: string;

  @CreateDateColumn({ name: 'fecha_creacion' })
  @Expose({ name: 'created_at' })
  fecha_creacion: Date;
}
