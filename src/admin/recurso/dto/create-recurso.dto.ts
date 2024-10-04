import { IsString, IsOptional } from 'class-validator';

export class CreateRecursoDto {

  nombre: string;

 
  descripcion?: string;


  imagen_url?: string;

 
  pdf_url?: string; 
}
