import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { Grupo } from './grupo.entity';
import { Usuario } from 'src/users/entity/usuario.entity';

@Entity('grupo_miembro')
export class GrupoMiembro {
  @PrimaryGeneratedColumn('uuid')
  grupo_miembro_id: string;

  @ManyToOne(() => Grupo, (grupo) => grupo.miembros)
  grupo: Grupo;

  @Column()
  grupo_id: string;

  @ManyToOne(() => Usuario)
  usuario: Usuario;

  @Column()
  usuario_id: string;
}
