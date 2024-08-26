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

  async updateProfile(usuarioId: string, updateProfileDto: UpdateProfileDto, avatar: Express.Multer.File): Promise<Usuario> {
    if (!Object.keys(updateProfileDto).length && !avatar) {
      throw new BadRequestException('No hay valores para actualizar');
    }
  
    const updateData: any = { ...updateProfileDto };
    if (avatar) {
      updateData.avatar = avatar.buffer; // Guarda el buffer en la base de datos
    }
  
    await this.usuarioRepository.update({ usuario_id: usuarioId }, updateData);
    const updatedUser = await this.usuarioRepository.findOne({ where: { usuario_id: usuarioId } });
    if (!updatedUser) {
      throw new NotFoundException('Usuario no encontrado');
    }
  
    // Crear una copia del usuario para modificar solo la respuesta
    const userWithAvatarBase64 = { ...updatedUser } as any;
  
    // Convertir el buffer a base64 para enviarlo al frontend
    if (updatedUser.avatar) {
      userWithAvatarBase64.avatarBase64 = updatedUser.avatar.toString('base64');
    }
  
    return userWithAvatarBase64;
  }
  
  
  

}
