export class CreateProyectoDto {
  nombre: string;
  descripcion: string;
  ubicacion: string;
  tipo_aparceria: string;
  tamano_terreno: string;
  duracion_proyecto: string;
  numero_participantes: number;
  aportes_participantes: string;
  recursos_disponibles: string;
  modalidad_participacion: string;
  modelo_reparto: string;
  nombre_encargado: string;
  correo_contacto: string;
  telefono_contacto: string;
  icono_seleccionado: string;
  documentos_relevantes: string;
  imagen_representativa?: string;
  archivos?: string[]; // Añadir este campo
}
