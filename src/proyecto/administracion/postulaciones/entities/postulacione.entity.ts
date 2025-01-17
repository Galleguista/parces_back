import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('postulaciones', { schema: 'admin' })
export class Postulaciones {
  @PrimaryGeneratedColumn('uuid')
  postulacion_id: string;

  @Column('uuid')
  proyecto_id: string;

  @Column('uuid')
  usuario_id: string;

  @Column({ type: 'varchar', length: 50, default: 'pendiente' })
  estado: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha_creacion: Date;
}
