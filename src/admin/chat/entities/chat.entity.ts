import { Usuario } from 'src/users/entity/usuario.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity('chat')
export class Chat {
  @PrimaryGeneratedColumn('uuid')
  chat_id: string;

  @Column('uuid')
  usuario_id: string;

  @Column('text')
  contenido: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha_envio: Date;

  @Column('uuid')
  receptor_id: string;


  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;


  @JoinColumn({ name: 'receptor_id' })
  receptor: Usuario;
}
