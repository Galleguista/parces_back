import { Controller, Post, Body, UseGuards, Get, Request, Put, UseInterceptors, UploadedFile, BadRequestException, Query, NotFoundException, Param, Delete } from '@nestjs/common';
import { UserService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from 'src/multer.config'; 
import { ApiTags } from '@nestjs/swagger';
import { FilesService } from 'src/system/files/files.service';
import { RoleService } from 'src/system/role/role.service';

@ApiTags('usuarios')
@Controller('usuarios')
export class UsersController {
  constructor(
    private readonly usersService: UserService,
    private readonly filesService: FilesService, 
    private readonly roleService: RoleService
  ) {}

  @Post('register')
  @UseInterceptors(FileInterceptor('avatar', multerConfig())) 
  async register(
    @Body() createUserDto: CreateUserDto,
    @UploadedFile() file: Express.Multer.File, 
    @Request() req: any
  ) {
    try {
      const existingUser = await this.usersService.findByUsuario(createUserDto.correo_electronico);
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

  @Get('search')
  async searchUsers(@Query('query') query: string) {
    return this.usersService.searchUsers(query);
  }

  @UseGuards(JwtAuthGuard)
  @Put('me')
@UseInterceptors(FileInterceptor('avatar', multerConfig())) 
async updateProfile(
  @Request() req: any,
  @UploadedFile() file: Express.Multer.File, 
  @Body() updateUserDto: UpdateUserDto
) {
  console.log('Archivo subido:', file);
  console.log('Datos de actualización:', updateUserDto);

  const userId = req.user.usuario_id;

  let avatarPath = '';
  if (file) {
    const uploadResult = await this.filesService.handleFileUpload(file, req);
    avatarPath = uploadResult.relativePath;

    await this.usersService.updateAvatar(userId, avatarPath);
  }

  await this.usersService.update(userId, updateUserDto);
  const updatedUser = await this.usersService.findOne(userId);

  return updatedUser;
}

@UseGuards(JwtAuthGuard)
@Put(':id')
async updateUser(
  @Param('id') id: string,
  @Body() updateUserDto: UpdateUserDto
) {
  try {
    const updatedUser = await this.usersService.update(id, updateUserDto);
    return {
      success: true,
      message: 'Datos del usuario actualizados correctamente.',
      updatedUser,
    };
  } catch (error) {
    throw new BadRequestException('Error al actualizar el usuario.');
  }
}

@UseGuards(JwtAuthGuard)
@Get('me')
async getMe(@Request() req: any) {
  const userId = req.user.usuario_id;
  const user = await this.usersService.findOne(userId);
  const role = await this.roleService.findRoleByUserId(userId); 

  if (!role) {
    throw new NotFoundException('Role not found for the user');
  }

  const isAdmin = role.role_name === 'Administrador'; 

  const result = {
    ...user,
    isAdmin: isAdmin,
    avatar: user.avatar ? this.filesService.getFileUrl(user.avatar) : undefined,
  };

  return result;
}



  // @UseGuards(JwtAuthGuard)
  @Get()
  async getAllUsers() {
    return this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    try {
      await this.usersService.remove(id);
      return {
        success: true,
        message: 'Usuario eliminado correctamente.'
      };
    } catch (error) {
      throw new NotFoundException('Usuario no encontrado.');
    }
  }
}
