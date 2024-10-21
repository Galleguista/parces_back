import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { ConversacionesService } from './conversacion.service';


@Controller('conversaciones')
export class ConversacionesController {
    constructor(private readonly conversacionesService: ConversacionesService) {}

    @Post()
    async crearConversacion(@Body('tipo_conversacion_id') tipoConversacionId: string, @Body('grupo_id') grupoId?: string) {
        return this.conversacionesService.crearConversacion(tipoConversacionId, grupoId);
    }

    @Get('grupo/:grupoId')
    async obtenerConversacionesPorGrupo(@Param('grupoId') grupoId: string) {
        return this.conversacionesService.obtenerConversacionesPorGrupo(grupoId);
    }
}
