import { Mensaje } from 'src/admin/chat/mensaje/entities/mensaje.entity';
import { GrupoMiembro } from 'src/admin/grupos/entities/grupo-miembro.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity('usuario', { schema: 'admin' })
export class Usuario {
    @PrimaryGeneratedColumn('uuid')
    usuario_id: string;

    @Column({ length: 255 })
    nombre: string;

    @Column({ length: 255, unique: true })
    correo_electronico: string;

    @Column({ length: 50, nullable: true })
    celular: string;

    @Column({ length: 255 })
    password: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    fecha_registro: Date;

    @Column({ length: 50 })
    status: string;

    @Column({ type: 'text', nullable: true })
    direccion: string;

    @Column({ nullable: true })
    avatar: string;

    @OneToMany(() => Mensaje, mensaje => mensaje.usuario)
    mensajes: Mensaje[];

    @OneToMany(() => GrupoMiembro, grupoMiembro => grupoMiembro.usuario)
    grupos: GrupoMiembro[];
}
