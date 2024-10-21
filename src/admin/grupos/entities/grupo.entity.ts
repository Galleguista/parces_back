import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity('grupos', { schema: 'admin' })
export class Grupo {
    @PrimaryGeneratedColumn('uuid')
    grupo_id: string;

    @Column()
    nombre: string;

    @Column()
    descripcion: string;
}
