import { IsString, IsOptional } from 'class-validator';

export class CreateRecursoDto {
  @IsString()
  nombre: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsString()
  @IsOptional()
  imagen_url?: string;

  @IsString()
  @IsOptional()
  pdf_url?: string; 
}
