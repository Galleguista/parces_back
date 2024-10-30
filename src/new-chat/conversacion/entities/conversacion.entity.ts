import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('conversaciones', {schema: 'admin'})
export class Conversacion {
  @PrimaryGeneratedColumn('uuid')
  conversacion_id: string;

  @Column({ type: 'uuid' })
  tipo_conversacion_id: string; 

  @Column({ type: 'jsonb' })
  user_ids: { id: string }[];  

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha_creacion: Date;
}
