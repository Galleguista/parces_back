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

  @Column({ length: 255 })
  tamano_terreno: string;

  @Column({ length: 255 })
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

  @Column('text')
  documentos_relevantes: string;

  @Column('text', { nullable: true })
  imagen_representativa: string;
}
