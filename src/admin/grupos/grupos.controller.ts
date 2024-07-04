import { Controller, Post, Body, Param, UseGuards, Request, Get } from '@nestjs/common';
import { GruposService } from './grupos.service';
import { CreateGrupoDto } from './dto/create-grupo.dto';
import { AddGrupoMiembroDto } from './dto/add-grupo-miembro.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';


@Controller('grupos')
export class GruposController {
  constructor(private readonly gruposService: GruposService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  async createGrupo(@Body() createGrupoDto: CreateGrupoDto) {
    return this.gruposService.createGrupo(createGrupoDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':grupoId/miembros')
  async addMiembro(@Param('grupoId') grupoId: string, @Body() addGrupoMiembroDto: AddGrupoMiembroDto) {
    return this.gruposService.addMiembro(grupoId, addGrupoMiembroDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':grupoId')
  async getGrupoById(@Param('grupoId') grupoId: string) {
    return this.gruposService.getGrupoById(grupoId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':grupoId/mensajes')
  async getMensajes(@Param('grupoId') grupoId: string) {
    return this.gruposService.getMensajes(grupoId);
  }
}
