// logros.controller.ts
import { Controller, Post, Get, Param, UseGuards } from '@nestjs/common';
import { LogrosService } from './logros.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('logros')
export class LogrosController {
  constructor(private readonly logrosService: LogrosService) {}

  @UseGuards(JwtAuthGuard)
  @Post('unlock/:usuarioId/:logroId')
  async unlockLogro(@Param('usuarioId') usuarioId: string, @Param('logroId') logroId: string) {
    return this.logrosService.unlockLogro(usuarioId, logroId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('usuario/:usuarioId')
  async getLogrosByUsuarioId(@Param('usuarioId') usuarioId: string) {
    return this.logrosService.getLogrosByUsuarioId(usuarioId);
  }
}
