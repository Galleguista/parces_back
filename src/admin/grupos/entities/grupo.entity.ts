import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { GrupoMiembro } from './grupo-miembro.entity';
import { Chat } from 'src/admin/chat/entities/chat.entity';


@Entity('grupos', { schema: 'admin' })
export class Grupo {
    @PrimaryGeneratedColumn('uuid')
    grupo_id: string;

    @Column()
    nombre: string;

    @Column()
    descripcion: string;

    @OneToMany(() => GrupoMiembro, miembro => miembro.grupo)
    miembros: GrupoMiembro[];

    @OneToMany(() => Chat, chat => chat.grupo)
    chats: Chat[];
}
