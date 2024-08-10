import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('publicacion', { schema: 'admin' })
export class Publicacion {
  @PrimaryGeneratedColumn('uuid')
  publicacion_id: string;

  @Column('uuid')
  usuario_id: string;

  @Column('text')
  contenido: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha_publicacion: Date;

  @Column('bytea', { nullable: true })
  imagen_url: Buffer;
}
