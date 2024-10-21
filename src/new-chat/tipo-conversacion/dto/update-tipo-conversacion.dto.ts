import { PartialType } from '@nestjs/swagger';
import { CreateTipoConversacionDto } from './create-tipo-conversacion.dto';

export class UpdateTipoConversacionDto extends PartialType(CreateTipoConversacionDto) {}
