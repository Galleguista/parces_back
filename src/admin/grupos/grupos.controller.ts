import { Controller, Post, Body, UseGuards, Get, Request, Param, NotFoundException } from '@nestjs/common';
import { GruposService } from './grupos.service';
import { CreateGrupoDto } from './dto/create-grupo.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('grupos')
@Controller('grupos')
export class GruposController {
  constructor(private readonly gruposService: GruposService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  async create(@Body() createGrupoDto: CreateGrupoDto, @Body('usuarios') usuarioIds: string[], @Request() req) {
    const usuarioId = req.user.sub;

    // Verificar que usuarioId no sea undefined antes de añadirlo
    if (!usuarioId) {
      console.error('El usuarioId del creador del grupo es undefined');
      throw new NotFoundException('No se pudo identificar al creador del grupo');
    }

    if (!usuarioIds.includes(usuarioId)) {
      usuarioIds.push(usuarioId);
    }

    console.log(`Creating group: usuarioId=${usuarioId}, usuarioIds=${usuarioIds}`);
    return this.gruposService.createGrupo(createGrupoDto, usuarioIds);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':grupoId/miembros')
  async addMiembro(@Param('grupoId') grupoId: string, @Request() req) {
    const usuarioId: string = req.user.sub;
    console.log(`Adding member to group: grupoId=${grupoId}, usuarioId=${usuarioId}`); 
    return this.gruposService.addMemberToGroup(grupoId, usuarioId);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.gruposService.getGrupos();
  }
}
