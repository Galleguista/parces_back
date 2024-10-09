import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './entity/usuario.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcryptjs';
import { FilesService } from 'src/system/files/files.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Usuario)
    private usersRepository: Repository<Usuario>,
    private readonly filesService: FilesService, // Añadimos el FilesService
  ) {}

  async findByEmail(correo_electronico: string): Promise<Usuario | undefined> {
    return this.usersRepository.findOne({ where: { correo_electronico } });
  }

  async findById(usuario_id: string): Promise<Usuario | undefined> {
    return this.usersRepository.findOne({ where: { usuario_id } });
  }

  async findAll(): Promise<Usuario[]> {
    return this.usersRepository.find();
  }

  async createUser(createUserDto: CreateUserDto, avatarPath?: string): Promise<Usuario> {
    const { password, ...userData } = createUserDto;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = this.usersRepository.create({
      ...userData,
      password: hashedPassword,
      avatar: avatarPath, // Asignamos la ruta del avatar
    });

    return this.usersRepository.save(newUser);
  }

  async update(id: string, updateUserDto: UpdateUserDto, avatarPath?: string): Promise<void> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    if (avatarPath) {
      updateUserDto.avatar = avatarPath; // Asignamos la nueva ruta del avatar
    }

    await this.usersRepository.update({ usuario_id: id }, updateUserDto);
  }
}
