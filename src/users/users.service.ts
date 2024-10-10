import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { instanceToPlain } from 'class-transformer';
import * as bcrypt from 'bcryptjs';
import { Usuario } from './entity/usuario.entity';


@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Usuario) 
    private usuarioRepository: Repository<Usuario>,
  ) {}

  async findAll(): Promise<any[]> {
    const users = await this.usuarioRepository.find({
      order: { nombre: 'ASC' },
      relations: ['mensajes', 'grupos'],  
    });
    return users.map(user => instanceToPlain(user));  
  }

  
  async findOne(id: string): Promise<any> {
    const user = await this.usuarioRepository.findOne({
      where: { usuario_id: id },
      relations: ['mensajes', 'grupos'],
    });
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
    return instanceToPlain(user);  
  }

  
  async create(createUserDto: CreateUserDto): Promise<any> {
    const { password, ...userData } = createUserDto;
    
    
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = this.usuarioRepository.create({
      ...userData,
      password: hashedPassword,
      status: createUserDto.status || 'active', 
    });

    const savedUser = await this.usuarioRepository.save(newUser);
    return instanceToPlain(savedUser);  
  }

  
  async update(id: string, updateUserDto: UpdateUserDto): Promise<any> {
    const user = await this.usuarioRepository.findOne({ where: { usuario_id: id } });

    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    
    Object.assign(user, updateUserDto);

    const updatedUser = await this.usuarioRepository.save(user);
    return instanceToPlain(updatedUser);  
  }

  async remove(id: string): Promise<void> {
    const deleteResult = await this.usuarioRepository.delete(id);

    if (deleteResult.affected === 0) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
  }

  
  async findByEmail(correo_electronico: string): Promise<Usuario | undefined> {
    return this.usuarioRepository.findOne({ where: { correo_electronico } });
  }
  
  async updateAvatar(id: string, avatarPath: string): Promise<any> {
    const user = await this.usuarioRepository.findOne({ where: { usuario_id: id } });

    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    user.avatar = avatarPath;
    const updatedUser = await this.usuarioRepository.save(user);

    return instanceToPlain(updatedUser);
  }

  
  async findActiveUsers(): Promise<any[]> {
    const users = await this.usuarioRepository.find({
      where: { status: 'true' },  
      order: { nombre: 'ASC' },
      relations: ['mensajes', 'grupos'],  
    });
    return users.map(user => instanceToPlain(user));  
  }

  
  async toggleStatus(id: string): Promise<any> {
    const user = await this.usuarioRepository.findOne({ where: { usuario_id: id } });

    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }


    user.status = user.status ? 'false' : 'true';

    const updatedUser = await this.usuarioRepository.save(user);
    return instanceToPlain(updatedUser);
  }
}
