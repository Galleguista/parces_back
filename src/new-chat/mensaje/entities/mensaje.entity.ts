import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('mensajes', {schema:'admin'})
export class Mensaje {
  @PrimaryGeneratedColumn('uuid')
  mensaje_id: string;

  @Column()
  conversacion_id: string;

  @Column()
  usuario_id: string;  

  @Column('json')
  contenido: { texto: string };

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha_envio: Date;
}
