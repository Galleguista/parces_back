import { Controller, Get } from '@nestjs/common';
import { TipoConversacionService } from './tipo-conversacion.service';

@Controller('tipo-conversacion')
export class TipoConversacionController {
  constructor(private readonly tipoConversacionService: TipoConversacionService) {}

  @Get()
  findAll() {
    return this.tipoConversacionService.findAll();
  }
}
