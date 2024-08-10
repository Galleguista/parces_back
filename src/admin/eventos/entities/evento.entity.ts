import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('evento', { schema: 'admin' })
export class Evento {
  @PrimaryGeneratedColumn('uuid')
  evento_id: string;

  @Column({ length: 255 })
  nombre: string;

  @Column('text', { nullable: true })
  descripcion: string;

  @Column({ type: 'date' })
  fecha: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha_creacion: Date;
}
