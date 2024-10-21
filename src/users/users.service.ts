import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Usuario } from './entity/usuario.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
  ) {}

  // Obtener todos los usuarios
  async findAll(): Promise<Usuario[]> {
    return this.usuarioRepository.find({
      order: { nombre: 'ASC' },
    });
  }

  // Obtener un usuario por su ID
  async findOne(userId: string): Promise<Usuario> {
    const user = await this.usuarioRepository.findOne({ where: { usuario_id: userId } });
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${userId} no encontrado`);
    }
    return user;
  }

  // Crear un nuevo usuario
  async create(createUserDto: CreateUserDto): Promise<Usuario> {
    const { password, ...userData } = createUserDto;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = this.usuarioRepository.create({
      ...userData,
      password: hashedPassword,
    });

    return this.usuarioRepository.save(newUser);
  }

  // Actualizar un usuario
  async update(id: string, updateUserDto: UpdateUserDto): Promise<Usuario> {
    const user = await this.findOne(id);

    Object.assign(user, updateUserDto);
    return this.usuarioRepository.save(user);
  }

  // Eliminar un usuario
  async remove(id: string): Promise<void> {
    const deleteResult = await this.usuarioRepository.delete(id);
    if (deleteResult.affected === 0) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
  }

  // Buscar usuario por correo electrónico
  async findByEmail(correo_electronico: string): Promise<Usuario | undefined> {
    return this.usuarioRepository.findOne({ where: { correo_electronico } });
  }

  // Actualizar avatar del usuario
  async updateAvatar(id: string, avatarPath: string): Promise<Usuario> {
    const user = await this.findOne(id);
    user.avatar = avatarPath;
    return this.usuarioRepository.save(user);
  }
}
