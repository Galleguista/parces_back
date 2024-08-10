import { Controller, Post, Param, UseGuards, Request, Get } from '@nestjs/common';
import { AmigosService } from './amigos.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('amigos')
@Controller('amigos')
export class AmigosController {
  constructor(private readonly amigosService: AmigosService) {}

  @UseGuards(JwtAuthGuard)
  @Post(':amigoId')
  async addAmigo(@Param('amigoId') amigoId: string, @Request() req) {
    const usuarioId = req.user.usuario_id;
    return this.amigosService.addAmigo(usuarioId, amigoId);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAmigos(@Request() req) {
    const usuarioId = req.user.usuario_id;
    return this.amigosService.getAmigos(usuarioId);
  }
}
