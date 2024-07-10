import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { Chat } from '../../entities/chat.entity';
import { Usuario } from 'src/users/entity/usuario.entity';


@Entity('mensajes')
export class Mensaje {
  @PrimaryGeneratedColumn('uuid')
  mensaje_id: string;

  @ManyToOne(() => Chat,)
  chat: Chat;

  @Column()
  chat_id: string;

  @ManyToOne(() => Usuario,)
  usuario: Usuario;

  @Column()
  usuario_id: string;

  @ManyToOne(() => Usuario)
  receptor: Usuario;

  @Column()
  receptor_id: string;

  @Column({ nullable: true })
  contenido: string;

  @Column({ nullable: true })
  imagen_url: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha_envio: Date;
}
