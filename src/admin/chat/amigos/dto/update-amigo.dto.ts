import { PartialType } from '@nestjs/mapped-types';
import { CreateAmigoDto } from './create-amigo.dto';

export class UpdateAmigoDto extends PartialType(CreateAmigoDto) {}
