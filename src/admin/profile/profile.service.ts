import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
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
    if (!Object.keys(updateProfileDto).length) {
      throw new BadRequestException('No hay valores para actualizar');
    }

    const updateData: any = { ...updateProfileDto };
    if (updateProfileDto.avatar) {
      updateData.avatar = Buffer.from(updateProfileDto.avatar, 'base64');
    }

    await this.usuarioRepository.update({ usuario_id: usuarioId }, updateData);
    const updatedUser = await this.usuarioRepository.findOne({ where: { usuario_id: usuarioId } });
    if (!updatedUser) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return updatedUser;
  }
}
