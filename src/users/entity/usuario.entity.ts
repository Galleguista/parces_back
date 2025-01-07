import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('usuario', {schema:'admin'})
export class Usuario {
  @PrimaryGeneratedColumn('uuid')
  usuario_id: string;

  @Column()
  nombre: string;

  @Column()
  correo_electronico: string;

  @Column()
  celular: string;

  @Column()
  direccion: string;

  @Column()
  avatar: string;

  @Column()
  password: string;

  @Column({ default: 'true' })
  status: string;

  @Column() 
  usuario: string;

}