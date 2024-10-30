import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('tipo_conversacion', {schema:'admin'})
export class TipoConversacion {
  @PrimaryGeneratedColumn('uuid')
  tipo_conversacion_id: string;

  @Column({ type: 'varchar', length: 50 })
  nombre: string;  // Almacena el tipo de conversación ('foro', 'chat', 'grupo', etc.)
}
