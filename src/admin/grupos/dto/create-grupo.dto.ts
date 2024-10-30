import { IsString, IsArray, IsUUID } from 'class-validator';

export class CreateGrupoDto {
  @IsString()
  nombre: string;

  @IsString()
  descripcion: string;

  @IsArray()
  @IsUUID('4', { each: true })
  userIds: { id: string }[]; // Lista inicial de usuarios en formato JSON
}
