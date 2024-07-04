import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Usuario } from 'src/users/entity/usuario.entity';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
  ) {}

  async getProfile(usuarioId: string): Promise<Usuario> {
    const user = await this.usuarioRepository.findOne({ where: { usuario_id: usuarioId } });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return user;
  }

  async updateProfile(usuarioId: string, updateProfileDto: UpdateProfileDto): Promise<Usuario> {
    await this.usuarioRepository.update({ usuario_id: usuarioId }, updateProfileDto);
    const updatedUser = await this.usuarioRepository.findOne({ where: { usuario_id: usuarioId } });
    if (!updatedUser) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return updatedUser;
  }
}
