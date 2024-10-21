import { Controller, Get, Post, Body } from '@nestjs/common';
import { TipoConversacionService } from './tipo-conversacion.service';

@Controller('tipo-conversacion')
export class TipoConversacionController {
    constructor(private readonly tipoConversacionService: TipoConversacionService) {}

    @Post()
    async crearTipoConversacion(@Body('descripcion') descripcion: string) {
        return this.tipoConversacionService.crearTipoConversacion(descripcion);
    }

    @Get()
    async obtenerTodosLosTipos() {
        return this.tipoConversacionService.obtenerTodosLosTipos();
    }
}
