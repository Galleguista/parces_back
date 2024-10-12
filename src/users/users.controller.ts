import { Controller, Post, Body, UseGuards, Get, Request, Put, UseInterceptors, UploadedFile } from '@nestjs/common';
import { UserService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from 'src/multer.config'; 
import { ApiTags } from '@nestjs/swagger';
import { FilesService } from 'src/system/files/files.service';

@ApiTags('usuarios')
@Controller('usuarios')
export class UsersController {
  constructor(
    private readonly usersService: UserService,
    private readonly filesService: FilesService, 
  ) {}

  @Post('register')
  @UseInterceptors(FileInterceptor('avatar', multerConfig())) 
  async register(
    @Body() createUserDto: CreateUserDto,
    @UploadedFile() file: Express.Multer.File, 
    @Request() req: any
  ) {
    try {
      const existingUser = await this.usersService.findByEmail(createUserDto.correo_electronico);
      if (existingUser) {
        return {
          success: false,
          message: 'El correo electrónico ya está registrado.',
        };
      }

      createUserDto.status = 'true';
      let avatarPath = '';

      if (file) {
        const uploadResult = await this.filesService.handleFileUpload(file, req);
        avatarPath = uploadResult.relativePath; 

        createUserDto.avatar = avatarPath;
      }

      const newUser = await this.usersService.create(createUserDto);
      return {
        success: true,
        message: 'Usuario registrado correctamente.',
        newUser,
      };
    } catch (error) {
      console.error('Error durante el registro:', error);
      return {
        success: false,
        message: 'Error interno del servidor. Intente nuevamente.',
      };
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put('me')
  @UseInterceptors(FileInterceptor('avatar', multerConfig())) 
  async updateProfile(
    @Request() req: any,
    @UploadedFile() file: Express.Multer.File, 
    @Body() updateUserDto: UpdateUserDto
  ) {
    const userId = req.user.usuario_id;

    let avatarPath = '';
    if (file) {
      const uploadResult = await this.filesService.handleFileUpload(file, req);
      avatarPath = uploadResult.relativePath;

      // Actualizamos el avatar en la base de datos
      await this.usersService.updateAvatar(userId, avatarPath);
    }

    await this.usersService.update(userId, updateUserDto);
    const updatedUser = await this.usersService.findOne(userId);

    return updatedUser;
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@Request() req: any) {
    const userId = req.user.usuario_id;
    const user = await this.usersService.findOne(userId);

    if (user.avatar) {
      return {
        ...user,
        avatar: this.filesService.getFileUrl(user.avatar), 
      };
    }
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllUsers() {
    return this.usersService.findAll();
  }
}
