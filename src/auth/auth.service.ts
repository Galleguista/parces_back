import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';
import { RoleService } from 'src/system/role/role.service';


@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
    private readonly roleService: RoleService,
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
    // Obtenemos el rol asociado al usuario
    const role = await this.roleService.findRoleByUserId(user.usuario_id);

    if (!role) {
      throw new Error('El rol del usuario no está registrado.');
    }

    // Incluimos el role_id en el payload en lugar del role_name
    const payload = { 
      correo_electronico: user.correo_electronico, 
      sub: user.usuario_id, 
      nombre: user.nombre, 
      role_id: role.role_id // Incluimos role_id para identificar el rol
    };

    const token = this.jwtService.sign(payload);
    console.log('Generated token with role_id:', token); 

    return {
      access_token: token,
    };
  }
}
