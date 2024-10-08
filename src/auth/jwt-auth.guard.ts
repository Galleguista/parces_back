import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err, user, info, context: ExecutionContext) {
    if (err || !user) {
      console.error('Token no válido:', err, info);  // Para capturar y registrar errores de validación del token
      throw err || new UnauthorizedException('Token no válido');
    }
    return user;
  }
}

