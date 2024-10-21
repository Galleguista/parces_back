import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { GrupoService } from './grupos.service';

@Controller('grupos')
export class GrupoController {
    constructor(private readonly grupoService: GrupoService) {}

    @Post()
    createGrupo(@Body('nombre') nombre: string, @Body('descripcion') descripcion: string) {
        return this.grupoService.createGrupo(nombre, descripcion);
    }

    @Get(':grupoId')
    getGrupo(@Param('grupoId') grupoId: string) {
        return this.grupoService.getGrupo(grupoId);
    }

    @Get()
    getAllGrupos() {
        return this.grupoService.getAllGrupos();
    }
}
