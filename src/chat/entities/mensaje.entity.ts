import { Entity, PrimaryColumn, Column } from 'typeorm';
import { Expose } from 'class-transformer';

@Entity({ schema: 'chat', name: 'mensajes_adjuntos' })
export class MensajeAdjunto {
  @PrimaryColumn('uuid')
  @Expose({ name: 'attachment_id' })
  adjunto_id: string;

  @Column('uuid')
  @Expose({ name: 'message_id' })
  mensaje_id: string;

  @Column({ type: 'varchar', length: 50 })
  @Expose({ name: 'type' })
  tipo_adjunto: string;

  @Column('text')
  @Expose({ name: 'url' })
  url_adjunto: string;
}
