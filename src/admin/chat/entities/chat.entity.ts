import { Grupo } from 'src/admin/grupos/entities/grupo.entity';
import { Entity, PrimaryGeneratedColumn, OneToMany, ManyToOne } from 'typeorm';
import { Mensaje } from '../mensaje/entities/mensaje.entity';

@Entity('chats', { schema: 'admin' })
export class Chat {
    @PrimaryGeneratedColumn('uuid')
    chat_id: string;

    @ManyToOne(() => Grupo, grupo => grupo.chats, { nullable: true, onDelete: 'CASCADE' })
    grupo: Grupo;

    @OneToMany(() => Mensaje, mensaje => mensaje.chat)
    mensajes: Mensaje[];
}
