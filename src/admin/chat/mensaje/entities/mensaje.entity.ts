import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Chat } from '../../entities/chat.entity';
import { Usuario } from 'src/users/entity/usuario.entity';


@Entity('mensajes')
export class Mensaje {
  @PrimaryGeneratedColumn('uuid')
  mensaje_id: string;

  @Column('uuid')
  chat_id: string;

  @Column('uuid')
  usuario_id: string;

  @Column('text')
  contenido: string;

  @Column('text', { nullable: true })
  imagen_url: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha_envio: Date;

  @ManyToOne(() => Chat,)
  @JoinColumn({ name: 'chat_id' })
  chat: Chat;

  @ManyToOne(() => Usuario,)
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;
}
