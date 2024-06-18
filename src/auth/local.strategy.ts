import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'correo_electronico', 
      session: false,
    });
  }

  async validate(correo_electronico: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(correo_electronico, password);
    if (!user) {
      throw new UnauthorizedException(); 
    }
    return user; 
  }
}
