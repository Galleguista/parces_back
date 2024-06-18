import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './entity/usuario.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Usuario)
    private usersRepository: Repository<Usuario>,
  ) {}

  async findByEmail(correo_electronico: string): Promise<Usuario | undefined> {
    return this.usersRepository.findOne({ where: { correo_electronico } });
  }

  async findById(usuario_id: string): Promise<Usuario | undefined> {
    return this.usersRepository.findOne({ where: { usuario_id } });
  }

  async createUser(createUserDto: CreateUserDto): Promise<Usuario> {
    const { password, ...userData } = createUserDto;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = this.usersRepository.create({
      ...userData,
      password: hashedPassword,
    });
    return this.usersRepository.save(newUser);
  }
}
