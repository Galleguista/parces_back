import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class WsJwtAuthGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const client = context.switchToWs().getClient();
    const token = client.handshake.auth?.token;

    if (!token) {
      console.error('Token no proporcionado en el WebSocket handshake');
      throw new UnauthorizedException('Token no proporcionado');
    }

    try {
      const decoded = jwt.verify(token, this.configService.get<string>('JWT_SECRET')) as any;

      if (!decoded || !decoded.sub) {
        throw new UnauthorizedException('Token inválido');
      }

      // Adjuntar usuario al cliente para uso posterior
      client.data.usuario = {
        usuario_id: decoded.sub,
        correo_electronico: decoded.correo_electronico,
        nombre: decoded.nombre,
        role_id: decoded.role_id,
        scopes: decoded.scopes,
      };

      return true;
    } catch (err) {
      console.error('Error al validar el token:', err.message);
      throw new UnauthorizedException('Token inválido');
    }
  }
}
