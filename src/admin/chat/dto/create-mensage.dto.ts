export class CreateMensajeDto {
  chat_id: string;
  usuario_id: string;
  receptor_id: string;
  contenido?: string;
  imagen_url?: string;
}
