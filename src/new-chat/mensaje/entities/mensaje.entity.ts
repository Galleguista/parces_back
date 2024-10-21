import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('mensaje')
export class Mensaje {
  @PrimaryGeneratedColumn('uuid')
  mensaje_id: string;

  @Column({ type: 'jsonb' })
  contenido: object;

  @Column()
  conversacion_id: string;  

  @Column()
  remitente_id: string; 
}
