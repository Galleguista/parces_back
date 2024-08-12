// mensaje.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Chat } from 'src/admin/chat/entities/chat.entity';
import { Usuario } from 'src/users/entity/usuario.entity';

@Entity('mensajes', { schema: 'admin' })
export class Mensaje {
  @PrimaryGeneratedColumn('uuid')
  mensaje_id: string;

  @Column()
  chat_id: string;

  @Column()
  usuario_id: string;

  @ManyToOne(() => Chat, chat => chat.mensajes)
  chat: Chat;

  @ManyToOne(() => Usuario)
  usuario: Usuario;

  @Column()
  contenido: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha_envio: Date;
}
