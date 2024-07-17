import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { GruposService } from './grupos.service';
import { CreateGrupoDto } from './dto/create-grupo.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('grupos')
export class GruposController {
  constructor(private readonly gruposService: GruposService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  async create(@Body() createGrupoDto: CreateGrupoDto, @Request() req) {
    const usuarioId: string = req.user.sub;
    const grupo = await this.gruposService.createGrupo(createGrupoDto);
    await this.gruposService.addMemberToGroup(grupo.grupo_id, usuarioId);
    return grupo;
  }

  @UseGuards(JwtAuthGuard)
  @Post(':grupoId/miembros')
  async addMiembro(@Param('grupoId') grupoId: string, @Request() req) {
    const usuarioId: string = req.user.sub;
    return this.gruposService.addMemberToGroup(grupoId, usuarioId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('chats/private')
  async createPrivateChat(@Body('receptorId') receptorId: string, @Request() req) {
    const usuarioId: string = req.user.sub;
    return this.gruposService.createPrivateChat(usuarioId, receptorId);
  }

  @Get()
  findAll() {
    return this.gruposService.getGrupos();
  }
}
