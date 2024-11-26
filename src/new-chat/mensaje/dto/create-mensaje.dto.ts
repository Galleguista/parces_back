import { IsUUID, IsNotEmpty, IsObject } from 'class-validator';

export class CreateMensajeDto {
  @IsUUID()
  @IsNotEmpty()
  conversacion_id: string;

  @IsNotEmpty()
  @IsObject()
  contenido: {
    texto: string; 
    [key: string]: any;
  };
}
