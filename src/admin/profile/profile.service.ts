import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Usuario } from 'src/users/entity/usuario.entity';
import { FilesService } from 'src/system/files/files.service';


@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
    private readonly filesService: FilesService,
  ) {}

  async getProfile(usuarioId: string): Promise<Usuario> {
    const user = await this.usuarioRepository.findOne({ where: { usuario_id: usuarioId } });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return user;
  }

  getAvatarUrl(avatarPath: string): string | null {
    if (!avatarPath) {
      return null;
    }
    return this.filesService.getFileUrl(avatarPath);
  }

  async updateProfile(usuarioId: string, updateProfileDto: UpdateProfileDto, avatar?: Express.Multer.File): Promise<Usuario> {
    if (!Object.keys(updateProfileDto).length && !avatar) {
      throw new BadRequestException('No hay valores para actualizar');
    }

    const updateData: any = { ...updateProfileDto };

    if (avatar) {
      const avatarPath = await this.filesService.handleFileUpload(avatar, { user: { usuario_id: usuarioId } });
      updateData.avatar = avatarPath.relativePath;
    }

    await this.usuarioRepository.update({ usuario_id: usuarioId }, updateData);
    const updatedUser = await this.usuarioRepository.findOne({ where: { usuario_id: usuarioId } });
    if (!updatedUser) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const userWithAvatarUrl = { ...updatedUser } as any;

    if (updatedUser.avatar) {
      userWithAvatarUrl.avatarUrl = this.getAvatarUrl(updatedUser.avatar);
    }

    return userWithAvatarUrl;
  }
}
