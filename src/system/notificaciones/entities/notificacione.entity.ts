import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('notificaciones', { schema: 'admin' })
export class Notificacion {
  @PrimaryGeneratedColumn('uuid')
  notificacion_id: string;

  @Column({ type: 'uuid' })
  usuario_id: string;

  @Column({ type: 'text' })
  mensaje: string;

  @Column({ type: 'varchar', length: 50, default: 'info' })
  tipo: string;

  @Column({ type: 'boolean', default: false })
  leida: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  fecha_creacion: Date;
}
