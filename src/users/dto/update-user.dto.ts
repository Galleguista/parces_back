import { IsString, IsEmail, IsOptional } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  nombre?: string;

  @IsEmail()
  @IsOptional()
  correo_electronico?: string;

  @IsString()
  @IsOptional()
  celular?: string;

  @IsString()
  @IsOptional()
  direccion?: string;

  @IsOptional()
  @IsString()
  avatar?: string;
}
