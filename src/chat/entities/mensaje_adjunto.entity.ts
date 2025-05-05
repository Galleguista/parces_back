import { Entity, PrimaryColumn, Column, CreateDateColumn } from 'typeorm';
import { Expose } from 'class-transformer';

@Entity({ schema: 'chat', name: 'mensajes' })
export class Mensaje {
  @PrimaryColumn('uuid')
  @Expose({ name: 'message_id' })
  mensaje_id: string;

  @Column('uuid')
  @Expose({ name: 'conversation_id' })
  conversacion_id: string;

  @Column('uuid')
  @Expose({ name: 'user_id' })
  usuario_id: string;

  @CreateDateColumn({ name: 'fecha_envio' })
  @Expose({ name: 'sent_at' })
  fecha_envio: Date;

  @Column('text')
  @Expose({ name: 'content' })
  contenido: string;
}
