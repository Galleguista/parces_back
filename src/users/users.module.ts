import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './users.service';
import { UsersController } from './users.controller';
import { Usuario } from './entity/usuario.entity';
import { FilesService } from 'src/system/files/files.service';
import { RoleService } from 'src/system/role/role.service';
import { Role } from 'src/system/role/entities/role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Usuario, Role])],
  providers: [UserService, FilesService, RoleService],
  controllers: [UsersController],
  exports: [TypeOrmModule, UserService], 
})
export class UsersModule {}
