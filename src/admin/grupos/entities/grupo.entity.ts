import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { GrupoMiembro } from './grupo-miembro.entity';

@Entity('grupo')
export class Grupo {
  @PrimaryGeneratedColumn('uuid')
  grupo_id: string;

  @Column({ length: 255 })
  nombre: string;

  @Column('text', { nullable: true })
  descripcion: string;

  @Column('text', { nullable: true })
  imagen_url: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha_creacion: Date;

  @OneToMany(() => GrupoMiembro, grupoMiembro => grupoMiembro.grupo)
  miembros: GrupoMiembro[];
}
