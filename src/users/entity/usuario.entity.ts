import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('usuario')
export class Usuario {
  @PrimaryGeneratedColumn('uuid')
  usuario_id: string;

  @Column({ length: 255 })
  nombre: string;

  @Column({ length: 255, unique: true })
  correo_electronico: string;

  @Column({ length: 50, nullable: true })
  celular: string;

  @Column({ length: 255 })
  password: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha_registro: Date;

  @Column({ length: 50 })
  status: string;

  @Column({ type: 'uuid', default: () => 'uuid_generate_v4()' })
  codigoreferencia: string;

  @Column('text', { nullable: true })
  direccion: string;
}
