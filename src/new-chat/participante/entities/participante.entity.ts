import { Conversacion } from 'src/new-chat/conversacion/entities/conversacion.entity';
import { Usuario } from 'src/users/entity/usuario.entity';
import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';



@Entity('participantes')
export class Participante {
    @PrimaryGeneratedColumn('uuid')
    participante_id: string;

    @ManyToOne(() => Conversacion, conversacion => conversacion.conversacion_id, { onDelete: 'CASCADE' })
    conversacion: Conversacion;

    @ManyToOne(() => Usuario, usuario => usuario.usuario_id, { onDelete: 'CASCADE' })
    usuario: Usuario;
}
