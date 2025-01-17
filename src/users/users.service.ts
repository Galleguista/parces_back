import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Usuario } from './entity/usuario.entity';
import * as bcrypt from 'bcryptjs';
import { NotificacionesService } from 'src/system/notificaciones/notificaciones.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
    private notificacionesService: NotificacionesService,
  ) {}

  async findAll(): Promise<any[]> {
    const usuarios = await this.usuarioRepository
      .createQueryBuilder('usuario')
      .leftJoin('user_role', 'ur', 'ur.user_id = usuario.usuario_id')
      .leftJoin('role', 'r', 'r.role_id = ur.role_id') 
      .select([
        'usuario.usuario_id',
        'usuario.nombre',
        'usuario.usuario',
        'usuario.correo_electronico',
        'usuario.celular',
        'usuario.direccion',
        'ur.userol_id', // Incluye el ID de la relación
        'r.role_id',
        'r.role_name',
      ])
      .orderBy('usuario.nombre', 'ASC')
      .getRawMany();
  
    const usuariosConRoles = usuarios.reduce((acc, row) => {
      const usuarioExistente = acc.find((u) => u.usuario_id === row.usuario_usuario_id);
  
      if (usuarioExistente) {
        usuarioExistente.roles.push({
          userol_id: row.ur_userol_id,
          role_id: row.r_role_id,
          role_name: row.r_role_name,
        });
      } else {
        acc.push({
          usuario_id: row.usuario_usuario_id,
          nombre: row.usuario_nombre,
          usuario: row.usuario_usuario,
          correo_electronico: row.usuario_correo_electronico,
          celular: row.usuario_celular,
          direccion: row.usuario_direccion,
          roles: row.r_role_id
            ? [
                {
                  userol_id: row.ur_userol_id,
                  role_id: row.r_role_id,
                  role_name: row.r_role_name,
                },
              ]
            : [],
        });
      }
  
      return acc;
    }, []);
  
    return usuariosConRoles;
  }
  
  async findOne(userId: string): Promise<Usuario> {
    const user = await this.usuarioRepository.findOne({ where: { usuario_id: userId } });
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${userId} no encontrado`);
    }
    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<Usuario> {
    const { password, ...userData } = createUserDto;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = this.usuarioRepository.create({
      ...userData,
      password: hashedPassword,
    });

    const savedUser = await this.usuarioRepository.save(newUser);

    try {
      await this.notificacionesService.crearNotificacion(
        savedUser.usuario_id,
        '¡Bienvenido a la plataforma! Nos alegra tenerte aquí.',
        'success'
      );
    } catch (error) {
      console.error('Error al crear la notificación de bienvenida:', error);
    }

    return savedUser;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<Usuario> {
    const user = await this.findOne(id);

    Object.assign(user, updateUserDto);
    return this.usuarioRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    // Busca al usuario por ID antes de intentar eliminarlo
    const user = await this.usuarioRepository.findOne({ where: { usuario_id: id } });
  
    if (!user) {
      console.log(`Usuario con ID ${id} no encontrado`); // Log adicional
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
  
    // Elimina al usuario si existe
    const deleteResult = await this.usuarioRepository.delete(id);
  
    if (deleteResult.affected === 0) {
      console.log(`No se pudo eliminar el usuario con ID ${id}`); // Log adicional
      throw new NotFoundException(`No se pudo eliminar el usuario con ID ${id}`);
    }
  }
  

  async findByUsuario(usuario: string): Promise<Usuario | undefined> {
    return this.usuarioRepository.findOne({ where: { usuario } });
  }
  
  async findUsersByIds(userIds: string[]) {
    return this.usuarioRepository.find({
      where: { usuario_id: In(userIds) },
      select: ['usuario_id', 'nombre', 'avatar'],
    });
  }

  async searchUsers(query: string): Promise<Usuario[]> {
    if (!query || query.trim() === '') {
      throw new Error('El parámetro de búsqueda no puede estar vacío.');
    }
  
    const allUsers = await this.findAll();
  
    return allUsers.filter(user => 
      user.usuario?.toLowerCase().includes(query.toLowerCase())
    );
  }
  
  async updateAvatar(id: string, avatarPath: string): Promise<Usuario> {
    const user = await this.findOne(id);
    user.avatar = avatarPath;
    return this.usuarioRepository.save(user);
  }

  async updatePassword(userId: string, newPassword: string): Promise<void> {
    const user = await this.findOne(userId);
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${userId} no encontrado`);
    }
  
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
  
    await this.usuarioRepository.save(user);
  }
  
}
