import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('formulario', { schema: 'admin' })
export class Formulario {
  @PrimaryGeneratedColumn('uuid')
  formulario_id: string;

  @Column('uuid')
  proyecto_id: string;

  @Column('text')
  pregunta: string;
}
