import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Grupo } from './grupo.entity';
import { Usuario } from 'src/users/entity/usuario.entity';

@Entity('grupo_miembro')
export class GrupoMiembro {
  @PrimaryGeneratedColumn('uuid')
  grupo_miembro_id: string;

  @Column('uuid')
  grupo_id: string;

  @Column('uuid')
  usuario_id: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha_union: Date;

  @ManyToOne(() => Grupo, grupo => grupo.miembros)
  @JoinColumn({ name: 'grupo_id' })
  grupo: Grupo;
  
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;
}
