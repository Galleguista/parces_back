import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './users.service';
import { UsersController } from './users.controller';
import { Usuario } from './entity/usuario.entity';
import { FilesService } from 'src/system/files/files.service';
import { RoleService } from 'src/system/role/role.service';
import { Role } from 'src/system/role/entities/role.entity';
import { NotificacionesService } from 'src/system/notificaciones/notificaciones.service';
import { Notificacion } from 'src/system/notificaciones/entities/notificacione.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Usuario, Role, Notificacion])],
  providers: [UserService, FilesService, RoleService, NotificacionesService],
  controllers: [UsersController],
  exports: [TypeOrmModule, UserService], 
})
export class UsersModule {}
