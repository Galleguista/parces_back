export class NewMessageEventDto {
    mensaje_id: string;
    conversacion_id: string;
    usuario_id: string;
    contenido: string;
    fecha_envio: string;
    adjuntos?: {
      tipo: string;
      url: string;
    }[];
  }
  