import { Controller, Post, Body, UseGuards, Get, Request, Put, UseInterceptors, UploadedFile } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('usuarios')
@Controller('usuarios')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

 
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@Request() req) {
    const userId = req.user.usuario_id;
    const user = await this.usersService.findById(userId);
    if (user.avatar) {
      return {
        ...user,
        avatar: user.avatar.toString('base64'),
      };
    }
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Put('me')
  @UseInterceptors(FileInterceptor('avatar'))
  async updateProfile(@Request() req, @UploadedFile() file: Express.Multer.File, @Body() updateUserDto: UpdateUserDto) {
    const userId = req.user.usuario_id;
    if (file) {
      updateUserDto.avatar = file.buffer;
    }
    await this.usersService.update(userId, updateUserDto);
    const updatedUser = await this.usersService.findById(userId);
    if (updatedUser.avatar) {
      return {
        ...updatedUser,
        avatar: updatedUser.avatar.toString('base64'),
      };
    }
    return updatedUser;
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllUsers() {
    return this.usersService.findAll();
  }
}
