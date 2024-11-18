import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';
import { RoleService } from 'src/system/role/role.service';
import { RoleScopeService } from 'src/system/role-scope/role-scope.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
    private readonly roleService: RoleService,
    private readonly roleScopeService: RoleScopeService, // Inyecta RoleScopeService
  ) {}

  async validateUser(usuario: string, pass: string): Promise<any> {
    const user = await this.usersService.findByUsuario(usuario); // Asegúrate de usar este método
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null; // Si no coincide, devuelve null
  }  

  async login(user: any) {
    const role = await this.roleService.findRoleByUserId(user.usuario_id);
  
    if (!role) {
      throw new Error('El rol del usuario no está registrado.');
    }
  
    const scopes = await this.roleScopeService.findScopesByRoleId(role.role_id);
  
    const payload = { 
      usuario: user.usuario, // Cambiado a 'usuario'
      sub: user.usuario_id, 
      nombre: user.nombre, 
      role_id: role.role_id, 
      scopes,
    };
  
    const token = this.jwtService.sign(payload);
    console.log('Generated token with scopes:', token); 
  
    return {
      access_token: token,
    };
  }  
}
