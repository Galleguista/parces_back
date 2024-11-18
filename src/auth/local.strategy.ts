import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'usuario', // Cambiado a 'usuario'
      session: false,
    });
  }

  async validate(usuario: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(usuario, password);
    if (!user) {
      throw new UnauthorizedException('Credenciales incorrectas.'); 
    }
    return user; 
  }
}
