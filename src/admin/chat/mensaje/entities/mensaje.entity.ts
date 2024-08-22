import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Chat } from '../../entities/chat.entity';
import { Usuario } from 'src/users/entity/usuario.entity';

@Entity('mensajes', {schema: 'admin'})
export class Mensaje {
    @PrimaryGeneratedColumn('uuid')
    mensaje_id: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    fecha_envio: Date;

    @ManyToOne(() => Chat, chat => chat.mensajes, { onDelete: 'CASCADE' })
    chat: Chat;

    @ManyToOne(() => Usuario, usuario => usuario.mensajes, { onDelete: 'CASCADE' })
    usuario: Usuario;

    @Column()
    contenido: string;
}
