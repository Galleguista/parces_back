import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './users.service';
import { UsersController } from './users.controller';
import { Usuario } from './entity/usuario.entity';
import { FilesService } from 'src/system/files/files.service';

@Module({
  imports: [TypeOrmModule.forFeature([Usuario])],
  providers: [UserService, FilesService],
  controllers: [UsersController],
  exports: [TypeOrmModule, UserService], 
})
export class UsersModule {}
