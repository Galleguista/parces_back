import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('respuestas', { schema: 'admin' })
export class Respuestas {
  @PrimaryGeneratedColumn('uuid')
  respuesta_id: string;

  @Column('uuid')
  postulacion_id: string;

  @Column('uuid')
  formulario_id: string;

  @Column('text')
  respuesta: string;
}
