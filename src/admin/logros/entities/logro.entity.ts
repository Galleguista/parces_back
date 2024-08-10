import { Usuario } from 'src/users/entity/usuario.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';


@Entity('logro', { schema: 'admin' })
export class Logro {
  @PrimaryGeneratedColumn('uuid')
  logro_id: string;

  @Column('uuid')
  usuario_id: string;

  @Column({ length: 255 })
  titulo: string;

  @Column('text', { nullable: true })
  descripcion: string;

  @Column('text', { nullable: true })
  imagen_url: string;

  @Column('date', { nullable: true })
  fecha_obtencion: Date;

  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;
}
