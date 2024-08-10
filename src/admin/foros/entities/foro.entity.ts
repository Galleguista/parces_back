import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('foro', { schema: 'admin' })
export class Foro {
  @PrimaryGeneratedColumn('uuid')
  foro_id: string;

  @Column({ length: 255 })
  nombre: string;

  @Column('text', { nullable: true })
  descripcion: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha_creacion: Date;
}
