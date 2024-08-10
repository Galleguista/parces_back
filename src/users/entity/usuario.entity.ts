import { Chat } from 'src/admin/chat/entities/chat.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';

@Entity('usuario', { schema: 'admin' })
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

  @Column()
  codigoreferencia: string;

  @Column('text', { nullable: true })
  direccion: string;

  @Column({ type: 'bytea', nullable: true })
  avatar: Buffer;

  @ManyToMany(() => Chat, chat => chat.usuarios)
  chats: Chat[];
}
