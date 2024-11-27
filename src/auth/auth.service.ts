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
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
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

    const token = this.jwtService.sign(payload);

    return {
      access_token: token,
    };
  }

  async validateWsToken(token: string) {
    try {
      const payload = this.jwtService.verify(token); // Valida el token
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
