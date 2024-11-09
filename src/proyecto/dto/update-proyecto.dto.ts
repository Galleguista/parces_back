export class UpdateProyectoDto {
    nombre?: string;
    descripcion?: string;
    ubicacion?: string;
    tipo_aparceria?: string;
    tamano_terreno?: string; // Cambiado a string
    duracion_proyecto?: string; // Cambiado a string
    numero_participantes?: number;
    aportes_participantes?: string;
    recursos_disponibles?: string;
    modalidad_participacion?: string;
    modelo_reparto?: string;
    nombre_encargado?: string;
    correo_contacto?: string;
    telefono_contacto?: string;
    icono_seleccionado?: string;
    aceptar_terminos?: boolean;
    publicar_comunidad?: boolean;
    usuario_id?: string;
    conversacion_id?: string;
    documentos_relevantes?: string;
    imagen_representativa?: string;
    archivos?: string[]; // Campo opcional
  }
  