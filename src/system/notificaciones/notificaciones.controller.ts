import { Controller, Post, Get, Param, Body, Patch, UseGuards, Req, Delete } from '@nestjs/common';
import { NotificacionesService } from './notificaciones.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('notificaciones')
export class NotificacionesController {
  constructor(private readonly notificacionesService: NotificacionesService) {}

  @Post('crear')
  async crearNotificacion(
    @Body('usuario_id') usuarioId: string,
    @Body('mensaje') mensaje: string,
    @Body('tipo') tipo: string,
  ) {
    return this.notificacionesService.crearNotificacion(usuarioId, mensaje, tipo);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async obtenerNotificaciones(@Req() req) {
    const usuarioId = req.user.usuario_id;
    if (!usuarioId) {
      throw new Error('El usuario_id no se encontró en el token.');
    }

    return this.notificacionesService.obtenerNotificacionesPorUsuario(usuarioId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async eliminarNotificacion(@Param('id') notificacionId: string) {
    return this.notificacionesService.eliminarNotificacion(notificacionId);
  }
}
