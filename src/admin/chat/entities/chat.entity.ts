// chat.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { Usuario } from 'src/users/entity/usuario.entity';
import { Mensaje } from 'src/admin/chat/mensaje/entities/mensaje.entity';

@Entity('chats', { schema: 'admin' })
export class Chat {
  @PrimaryGeneratedColumn('uuid')
  chat_id: string;

  @Column({ nullable: true })
  grupo_id: string;

  @ManyToMany(() => Usuario)
  @JoinTable()
  usuarios: Usuario[];

  @OneToMany(() => Mensaje, mensaje => mensaje.chat)
  mensajes: Mensaje[];
}
