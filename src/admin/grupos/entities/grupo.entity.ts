import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('grupos', {schema:'admin'})
export class Grupo {
  @PrimaryGeneratedColumn('uuid')
  grupo_id: string;

  @Column({ type: 'varchar', length: 255 })
  nombre: string;

  @Column({ type: 'varchar', length: 255 })
  descripcion: string;

  @Column({ type: 'uuid' })
  conversacion_id: string;  // Almacena el ID de la conversación asociada como UUID

  @Column()
  usuario_id: string;
}
