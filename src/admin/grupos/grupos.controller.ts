import { Controller, Post, Body, UseGuards, Get, Request, Param, NotFoundException } from '@nestjs/common';
import { GruposService } from './grupos.service';
import { CreateGrupoDto } from './dto/create-grupo.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('grupos')
@Controller('grupos')
export class GruposController {
  constructor(private readonly gruposService: GruposService) {}

// grupos.controller.ts
@UseGuards(JwtAuthGuard)
@Post('create')
async create(@Body() createGrupoDto: CreateGrupoDto, @Request() req) {
  console.log('User Info:', req.user);  // Verifica qué datos están disponibles aquí
  const usuarioId = req.user.usuario_id; // Ajusta según cómo configuraste la estrategia JWT
  if (!usuarioId) {
    throw new NotFoundException('No se pudo identificar al creador del grupo');
  }

  return this.gruposService.createGrupo(createGrupoDto, usuarioId);
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
