import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';
import { RoleService } from 'src/system/role/role.service';
import { RoleScopeService } from 'src/system/role-scope/role-scope.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
    private readonly roleService: RoleService,
    private readonly roleScopeService: RoleScopeService,
  ) {}

  async validateUser(usuario: string, pass: string): Promise<any> {
    const user = await this.usersService.findByUsuario(usuario);
    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado.');
    }
  
    const isPasswordValid = await bcrypt.compare(pass, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Contraseña incorrecta.');
    }
  
    const { password, ...result } = user; 
    return result;
  }
  

  async login(user: any) {
    const role = await this.roleService.findRoleByUserId(user.usuario_id);
  
    if (!role) {
      throw new Error('El rol del usuario no está registrado.');
    }
  
    const scopes = await this.roleScopeService.findScopesByRoleId(role.role_id);
  
    const payload = {
      usuario: user.usuario,
      sub: user.usuario_id,
      nombre: user.nombre,
      role_id: role.role_id,
      scopes,
    };
  
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '60m',
    });
  
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '7d',
    });
  
    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        algorithms: ['HS256'],
      });
  
      const newAccessToken = this.jwtService.sign({
        usuario: payload.usuario,
        sub: payload.sub,
        nombre: payload.nombre,
        role_id: payload.role_id,
        scopes: payload.scopes,
      });
  
      return { access_token: newAccessToken };
    } catch (error) {
      console.error('Error al renovar token:', error.message);
      throw new UnauthorizedException('Refresh token inválido o expirado.');
    }
  }
  
  async validateToken(token: string) {
    try {
      const payload = this.jwtService.verify(token, {
        algorithms: ['HS256'], // Asegura que el algoritmo sea válido
      });
      return {
        usuario: payload.usuario,
        sub: payload.sub,
        nombre: payload.nombre,
        role_id: payload.role_id,
        scopes: payload.scopes,
      };
    } catch (error) {
      console.error('Error al validar token:', error.message);
      throw new UnauthorizedException('Token inválido o expirado.');
    }
  }

  async validateWsToken(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      return {
        usuario_id: payload.sub,
        nombre: payload.nombre,
        role_id: payload.role_id,
      };
    } catch (error) {
      throw new Error('Token inválido o expirado.');
    }
  }
}
