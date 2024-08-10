import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { GrupoMiembro } from './grupo-miembro.entity';

@Entity('grupos', { schema: 'admin' })
export class Grupo {
  @PrimaryGeneratedColumn('uuid')
  grupo_id: string;

  @Column()
  nombre: string;

  @Column()
  descripcion: string;

  @OneToMany(() => GrupoMiembro, (grupoMiembro) => grupoMiembro.grupo)
  miembros: GrupoMiembro[];
}
