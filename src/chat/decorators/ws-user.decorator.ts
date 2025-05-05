import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service'; // ajusta si necesario

export interface JwtPayload {
  sub: string;
  usuario: string;
  nombre: string;
  role_id: string;
  scopes: string[];
  iat: number;
  exp: number;
}

let authService: AuthService;

export const setAuthServiceForWsUser = (service: AuthService) => {
  authService = service;
};

export const WsUser = createParamDecorator(
  async (validate: boolean = true, ctx: ExecutionContext): Promise<JwtPayload> => {
    if (ctx.getType() !== 'ws') {
      throw new Error('WsUser solo funciona en WebSocket');
    }

    const client = ctx.switchToWs().getClient();
    const token = client?.handshake?.auth?.token;

    console.log('[WsUser] Token recibido:', token);

    if (!token) {
      throw new UnauthorizedException('Token no proporcionado');
    }

    if (!authService) {
      throw new Error('AuthService no configurado. Llama a setAuthServiceForWsUser()');
    }

    try {
      const payload = validate
        ? await authService.validateToken(token) // AQUÍ USAMOS validateToken
        : decodeTokenLocally(token);

      if (!payload?.sub) {
        throw new UnauthorizedException('Token inválido (sin sub)');
      }

      console.log('[WsUser] Payload decodificado/verificado:', payload);
      return payload;
    } catch (error) {
      console.error('[WsUser] Error al procesar token:', error.message);
      throw new UnauthorizedException('Token inválido o expirado');
    }
  }
);

function decodeTokenLocally(token: string): JwtPayload {
  const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
  const json = decodeURIComponent(
    atob(base64)
      .split('')
      .map((c) => `%${c.charCodeAt(0).toString(16).padStart(2, '0')}`)
      .join('')
  );
  return JSON.parse(json);
}
