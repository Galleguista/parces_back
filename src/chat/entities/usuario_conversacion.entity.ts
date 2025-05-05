import { Entity, PrimaryColumn, Column } from 'typeorm';
import { Expose } from 'class-transformer';

@Entity({ schema: 'chat', name: 'usuarios_conversaciones' })
export class UsuarioConversacion {
  @PrimaryColumn('uuid')
  @Expose({ name: 'user_conversation_id' })
  usuario_conversacion_id: string;

  @Column('uuid')
  @Expose({ name: 'conversation_id' })
  conversacion_id: string;

  @Column('uuid')
  @Expose({ name: 'user_id' })
  usuario_id: string;
}
