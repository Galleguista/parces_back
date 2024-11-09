import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    console.log('Decoded JWT with scopes:', payload); // Para confirmar que los scopes están presentes
    return { 
      usuario_id: payload.sub, 
      correo_electronico: payload.correo_electronico, 
      nombre: payload.nombre,
      role_id: payload.role_id, 
      scopes: payload.scopes // Incluimos los scopes directamente en el contexto del usuario
    };
  }
}
