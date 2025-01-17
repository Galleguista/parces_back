import { PartialType } from '@nestjs/swagger';
import { CreatePostulacioneDto } from './create-postulacione.dto';

export class UpdatePostulacioneDto extends PartialType(CreatePostulacioneDto) {}
