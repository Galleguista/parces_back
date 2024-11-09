import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('proyecto', { schema: 'admin' })
export class Proyecto {
  @PrimaryGeneratedColumn('uuid')
  proyecto_id: string;

  @Column({ length: 255 })
  nombre: string;

  @Column('text')
  descripcion: string;

  @Column({ length: 255 })
  ubicacion: string;

  @Column({ length: 255 })
  tipo_aparceria: string;

  @Column({ type: 'varchar', length: 255 }) // Cambiado a string
  tamano_terreno: string;

  @Column({ type: 'varchar', length: 255 }) // Cambiado a string
  duracion_proyecto: string;

  @Column('int')
  numero_participantes: number;

  @Column('text')
  aportes_participantes: string;

  @Column('text')
  recursos_disponibles: string;

  @Column({ length: 255 })
  modalidad_participacion: string;

  @Column({ length: 255 })
  modelo_reparto: string;

  @Column({ length: 255 })
  nombre_encargado: string;

  @Column({ length: 255 })
  correo_contacto: string;

  @Column({ length: 50 })
  telefono_contacto: string;

  @Column({ length: 255 })
  icono_seleccionado: string;

  @Column('text', { nullable: true })
  documentos_relevantes: string;

  @Column('text', { nullable: true })
  imagen_representativa: string;

  @Column({ default: false })
  aceptar_terminos: boolean;

  @Column({ default: false })
  publicar_comunidad: boolean;

  @Column('uuid')
  usuario_id: string;

  @Column('uuid')
  conversacion_id: string;
}
