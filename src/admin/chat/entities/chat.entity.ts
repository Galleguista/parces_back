import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('chats')
export class Chat {
  @PrimaryGeneratedColumn('uuid')
  chat_id: string;

  @Column({ nullable: true })
  grupo_id: string;

  @Column({ nullable: true })
  contenido: string;

  @Column({ nullable: true })
  imagen_url: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha_envio: Date;
}
