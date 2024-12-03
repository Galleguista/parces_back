import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('bitacora', {schema: 'admin'})
export class Bitacora {
  @PrimaryGeneratedColumn('uuid')
  bitacora_id: string;

  @Column('uuid')
  proyecto_id: string;

  @Column('text')
  descripcion: string;

  @Column('timestamp')
  fecha: Date;

  @Column('jsonb', { nullable: true })
  complemento: any;
}
