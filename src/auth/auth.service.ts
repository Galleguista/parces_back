import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(correo_electronico: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(correo_electronico);
    if (user && await bcrypt.compare(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { correo_electronico: user.correo_electronico, sub: user.usuario_id, nombre: user.nombre };
    const token = this.jwtService.sign(payload);
    console.log('Generated token:', token);  // Para confirmar que el token se genere correctamente
    return {
      access_token: token,
    };
  }
  
  }

