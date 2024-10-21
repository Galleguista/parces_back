import { Grupo } from 'src/admin/grupos/entities/grupo.entity';
import { TipoConversacion } from 'src/new-chat/tipo-conversacion/entities/tipo-conversacion.entity';
import { Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';

@Entity('conversaciones')
export class Conversacion {
    @PrimaryGeneratedColumn('uuid')
    conversacion_id: string;

    @ManyToOne(() => TipoConversacion, tipo => tipo.tipo_conversacion_id, { onDelete: 'CASCADE' })
    tipo_conversacion: TipoConversacion;

    @ManyToOne(() => Grupo, grupo => grupo.grupo_id, { nullable: true, onDelete: 'CASCADE' })
    grupo: Grupo;

    @CreateDateColumn({ type: 'timestamp' })
    fecha_creacion: Date;
}
