import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('tipo_conversacion')
export class TipoConversacion {
    @PrimaryGeneratedColumn('uuid')
    tipo_conversacion_id: string;

    @Column({ type: 'varchar', length: 50 })
    descripcion: string; // Ejemplo: 'usuario', 'grupo', 'foro'
}
