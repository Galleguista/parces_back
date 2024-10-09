import { Controller, Get, Put, Body, UseGuards, Request, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from 'src/multer.config'; // Configuración de Multer

@ApiTags('profile')
@Controller('profile')
export class ProfileController {
  constructor(
    private readonly profileService: ProfileService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@Request() req) {
    const usuarioId: string = req.user.usuario_id;
    const user = await this.profileService.getProfile(usuarioId);

    const userProfile = {
      ...user,
      avatarUrl: user.avatar ? this.profileService.getAvatarUrl(user.avatar) : null, // Devuelve la URL del avatar
    };

    return userProfile; // Devuelve el objeto personalizado con la URL del avatar
  }

  @UseGuards(JwtAuthGuard)
  @Put('me')
  @UseInterceptors(FileInterceptor('avatar', multerConfig())) // Interceptor para manejar la subida de archivos
  async updateProfile(
    @Request() req,
    @Body() updateProfileDto: UpdateProfileDto,
    @UploadedFile() avatar: Express.Multer.File, // Archivo subido
  ) {
    const usuarioId: string = req.user.usuario_id;

    // Llamamos al servicio para actualizar el perfil, pasando el archivo de avatar si está presente
    return this.profileService.updateProfile(usuarioId, updateProfileDto, avatar);
  }
}
