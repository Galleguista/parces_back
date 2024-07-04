import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('recurso')
export class Recurso {
  @PrimaryGeneratedColumn('uuid')
  recurso_id: string;

  @Column({ length: 255 })
  nombre: string;

  @Column('text', { nullable: true })
  descripcion: string;

  @Column('text', { nullable: true })
  imagen_url: string;

  @Column('text')
  pdf_url: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha_creacion: Date;
}
