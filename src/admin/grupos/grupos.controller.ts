import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { GruposService } from './grupos.service';
import { CreateGrupoDto } from './dto/create-grupo.dto';
import { AddGrupoMiembroDto } from './dto/add-grupo-miembro.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('grupos')
export class GruposController {
  constructor(private readonly gruposService: GruposService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  async create(@Body() createGrupoDto: CreateGrupoDto, @Request() req) {
    const usuarioId: string = req.user.sub;
    return this.gruposService.createGrupo(createGrupoDto, usuarioId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':grupoId/miembros')
  async addMiembro(@Param('grupoId') grupoId: string, @Request() req) {
    const usuarioId: string = req.user.sub;
    return this.gruposService.addMiembro(grupoId, usuarioId);
  }

  @Get()
  findAll() {
    return this.gruposService.getGrupos();
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/miembros')
  async addMemberToGroup(@Param('id') grupoId: string, @Request() req) {
    const usuarioId: string = req.user.sub;
    return this.gruposService.addMemberToGroup(grupoId, usuarioId);
  }
}
