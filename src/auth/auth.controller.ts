import { Controller, Request, Post, UseGuards, Body, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from './jwt-auth.guard';

ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('ws-authenticate')
  async wsAuthenticate(@Body('token') token: string) {
    console.log('Token recibido para WebSocket:', token);

    if (!token) {
      console.error('Token no proporcionado.');
      throw new BadRequestException('El token es requerido.');
    }

    try {
      const usuarioData = await this.authService.validateWsToken(token);
      console.log('Datos del usuario validados:', usuarioData);
      return usuarioData;
    } catch (error) {
      console.error('Error validando token:', error.message);
      throw new BadRequestException('Token inválido o expirado.');
    }
  }
}
