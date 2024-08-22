import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Grupo } from './grupo.entity';
import { Usuario } from 'src/users/entity/usuario.entity';


@Entity('grupo_miembro', { schema: 'admin' })
export class GrupoMiembro {
    @PrimaryGeneratedColumn('uuid')
    grupo_miembro_id: string;

    @ManyToOne(() => Grupo, grupo => grupo.miembros, { onDelete: 'CASCADE' })
    grupo: Grupo;

    @ManyToOne(() => Usuario, usuario => usuario.grupos, { onDelete: 'CASCADE' })
    usuario: Usuario;
}
