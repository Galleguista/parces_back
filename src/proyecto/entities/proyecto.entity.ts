import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('proyecto', { schema: 'admin' })
export class Proyecto {
  @PrimaryGeneratedColumn('uuid')
  proyecto_id: string;

  @Column({ length: 255 })
  nombre: string;

  @Column('text', { nullable: true })
  descripcion: string;

  @Column('text', { nullable: true })
  objetivos: string;

  @Column('text', { nullable: true })
  actividades_planificadas: string;

  @Column({ length: 255, nullable: true })
  categoria: string;

  @Column({ length: 255, nullable: true })
  tipo_cultivo: string;

  @Column({ length: 255, nullable: true })
  tipo_ganaderia: string;

  @Column({ length: 255, nullable: true })
  otro: string;

  @Column({ length: 255, nullable: true })
  ubicacion_departamento: string;

  @Column({ length: 255, nullable: true })
  ubicacion_municipio: string;

  @Column({ length: 255, nullable: true })
  ubicacion_region: string;

  @Column({ length: 255, nullable: true })
  ubicacion_altitud: string;

  @Column({ length: 255, nullable: true })
  ubicacion_clima: string;

  @Column('text', { nullable: true })
  ubicacion_coordenadas: string;

  @Column({ nullable: true })
  cuenta_con_terreno: boolean;

  @Column({ length: 255, nullable: true })
  terreno_tamano: string;

  @Column('text', { nullable: true })
  terreno_vias_acceso: string;

  @Column('text', { nullable: true })
  terreno_acceso_recursos: string;

  @Column('text', { nullable: true })
  informacion_adicional: string;

  @Column({ length: 255, nullable: true })
  contacto_nombre: string;

  @Column({ length: 255, nullable: true })
  contacto_correo: string;

  @Column({ length: 50, nullable: true })
  contacto_telefono: string;

  @Column('text', { nullable: true })
  requisitos_participacion: string;

  @Column({ length: 255, nullable: true })
  experiencia_requerida: string;

  @Column({ length: 255, nullable: true })
  disponibilidad_tiempo: string;

  @Column('text', { nullable: true })
  competencias_especificas: string;

  @Column('text', { nullable: true })
  beneficios_aparcero: string;

  @Column('text', { nullable: true })
  condiciones_proyecto: string;

  @Column('text', { nullable: true })
  criterios_seleccion: string;

  @Column({ nullable: true })
  numero_participantes: number;

  @Column('text', { nullable: true })
  lista_recursos: string;

  @Column('text', { nullable: true })
  responsabilidades_aparcero: string;

  @Column('text', { nullable: true })
  colaboradores_buscados: string;

  @Column('date')
  fecha_de_inicio: Date;

  @Column('date', { nullable: true })
  fecha_de_fin: Date;

  @Column({ type: 'bytea', nullable: true })
  imagen_representativa: Buffer;

  @Column('text', { nullable: true })
  documentos_relevantes: string;
}
