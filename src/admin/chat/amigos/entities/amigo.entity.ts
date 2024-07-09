import { Usuario } from 'src/users/entity/usuario.entity';
import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';


@Entity('amigos')
export class Amigo {
  @PrimaryColumn('uuid')
  usuario_id: string;

  @PrimaryColumn('uuid')
  amigo_id: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha_agregado: Date;

  @ManyToOne(() => Usuario,)
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  @ManyToOne(() => Usuario,)
  @JoinColumn({ name: 'amigo_id' })
  amigo: Usuario;
}
