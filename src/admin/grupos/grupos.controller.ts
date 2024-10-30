import { Controller, Get, Post, Param, Body, UseGuards, Request } from '@nestjs/common';
import { CreateGrupoDto } from './dto/create-grupo.dto';
import { GrupoService } from './grupos.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('grupos')
export class GrupoController {
  constructor(private readonly grupoService: GrupoService) {}

  /**
   * Crea un nuevo grupo junto con su conversación asociada, incluyendo al creador como administrador.
   * @param createGrupoDto Datos del grupo.
   * @param body Incluye el tipo de conversación para la conversación asociada.
   * @param req Información del usuario autenticado extraída del JWT.
   * @returns Grupo creado con la conversación asociada.
   */
  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body() createGrupoDto: CreateGrupoDto,
    @Body('tipo_conversacion_id') tipo_conversacion_id: string,
    @Request() req: any,
  ) {
    const usuario_id = req.user.usuario_id; // Extrae el ID del usuario autenticado desde el JWT
    return this.grupoService.create(createGrupoDto, tipo_conversacion_id, usuario_id);
  }

  /**
   * Obtiene todos los grupos.
   * @returns Lista de todos los grupos.
   */
  @Get()
  findAll() {
    return this.grupoService.findAll();
  }

  /**
   * Obtiene un grupo específico por su ID.
   * @param id ID del grupo.
   * @returns Información del grupo.
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.grupoService.findOne(id);
  }

  /**
   * Obtiene los miembros de un grupo basado en el `conversacion_id` asociado.
   * @param grupo_id ID del grupo.
   * @returns Lista de usuarios miembros de la conversación, incluyendo el administrador.
   */
  @Get(':grupo_id/miembros')
  getMembersOfGrupo(@Param('grupo_id') grupo_id: string) {
    return this.grupoService.getMembersOfGrupo(grupo_id);
  }

  /**
   * Añade un miembro a la conversación de un grupo y actualiza el JSON `user_ids`.
   * @param grupo_id ID del grupo.
   * @param body Contiene el ID del usuario a añadir.
   * @returns Conversación actualizada.
   */
  @Post(':grupo_id/miembro')
  addMember(@Param('grupo_id') grupo_id: string, @Body() body: { usuario_id: string }) {
    return this.grupoService.addMember(grupo_id, body.usuario_id);
  }
}
