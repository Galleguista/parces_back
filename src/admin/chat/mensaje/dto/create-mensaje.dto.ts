import { IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateMensajeDto {
  @IsUUID()
  chat_id: string;

  @IsUUID()
  @IsOptional()
  usuario_id?: string;

  @IsUUID()
  @IsOptional()
  receptor_id?: string;

  @IsString()
  @IsOptional()
  contenido?: string;

  @IsString()
  @IsOptional()
  imagen_url?: string;
}
