import { Usuario } from 'src/users/entity/usuario.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';


@Entity('chats')
export class Chat {
  @PrimaryGeneratedColumn('uuid')
  chat_id: string;

  @Column('uuid')
  usuario_id: string;

  @Column('uuid')
  receptor_id: string;

  @Column('text')
  contenido: string;

  @Column('text', { nullable: true })
  imagen_url: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha_envio: Date;

  @ManyToOne(() => Usuario, )
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  @ManyToOne(() => Usuario,)
  @JoinColumn({ name: 'receptor_id' })
  receptor: Usuario;
}
