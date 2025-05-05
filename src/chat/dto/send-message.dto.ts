export class SendMessageDto {
    conversacion_id: string;
    usuario_id: string;
    contenido: string;
    adjuntos?: {
      tipo: string;
      url: string;
    }[];
  }
  