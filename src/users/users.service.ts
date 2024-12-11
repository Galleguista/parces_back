import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
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

  async findAll(): Promise<Usuario[]> {
    return this.usuarioRepository.find({
      order: { nombre: 'ASC' },
    });
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

    return this.usuarioRepository.save(newUser);
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<Usuario> {
    const user = await this.findOne(id);

    Object.assign(user, updateUserDto);
    return this.usuarioRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    const deleteResult = await this.usuarioRepository.delete(id);
    if (deleteResult.affected === 0) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
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
}
