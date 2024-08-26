import { Controller, Get, Put, Body, UseGuards, Request, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('profile')
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@Request() req) {
    const usuarioId: string = req.user.usuario_id;
    const user = await this.profileService.getProfile(usuarioId);
  
    const userProfile = {
      ...user,
      avatarBase64: user.avatar ? user.avatar.toString('base64') : null, // Crea la propiedad temporal
    };
  
    return userProfile; // Devuelve el objeto personalizado
  }
  
  
  @UseGuards(JwtAuthGuard)
  @Put('me')
  @UseInterceptors(FileInterceptor('avatar'))
  async updateProfile(
    @Request() req,
    @Body() updateProfileDto: UpdateProfileDto,
    @UploadedFile() avatar: Express.Multer.File,
  ) {
    console.log('Datos recibidos:', { updateProfileDto, avatar }); // Log para verificar los datos recibidos
    const usuarioId: string = req.user.usuario_id;
    return this.profileService.updateProfile(usuarioId, updateProfileDto, avatar);
  }
  
  
}
