import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { GrupoService } from './grupos.service';
import { CreateGrupoDto } from './dto/create-grupo.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('grupos')
export class GrupoController {
  constructor(private readonly grupoService: GrupoService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body() createGrupoDto: CreateGrupoDto,
    @Body('tipo_conversacion_id') tipo_conversacion_id: string,
    @Request() req: any,
  ) {
    const usuario_id = req.user.usuario_id; // Usuario autenticado
    return this.grupoService.create(createGrupoDto, tipo_conversacion_id, usuario_id);
  }

  @Get()
  findAll() {
    return this.grupoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.grupoService.findOne(id);
  }

  @Get(':grupo_id/miembros')
  getMembersOfGrupo(@Param('grupo_id') grupo_id: string) {
    return this.grupoService.getMembersOfGrupo(grupo_id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':grupo_id/miembro')
  addMember(
    @Param('grupo_id') grupo_id: string,
    @Body() body: { usuario_id: string },
    @Request() req: any,
  ) {
    const admin_id = req.user.usuario_id;
    return this.grupoService.addMember(grupo_id, body.usuario_id, admin_id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':grupo_id/miembro/:usuario_id')
  updateMember(
    @Param('grupo_id') grupo_id: string,
    @Param('usuario_id') usuario_id: string,
    @Body() updateData: any,
    @Request() req: any,
  ) {
    const admin_id = req.user.usuario_id;
    return this.grupoService.updateMember(grupo_id, usuario_id, updateData, admin_id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':grupo_id/miembro/:usuario_id')
  removeMember(
    @Param('grupo_id') grupo_id: string,
    @Param('usuario_id') usuario_id: string,
    @Request() req: any,
  ) {
    const admin_id = req.user.usuario_id;
    return this.grupoService.removeMember(grupo_id, usuario_id, admin_id);
  }
}
