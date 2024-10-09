import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { Usuario } from './entity/usuario.entity';
import { FilesService } from 'src/system/files/files.service';

@Module({
  imports: [TypeOrmModule.forFeature([Usuario])],
  providers: [UsersService, FilesService],
  controllers: [UsersController],
  exports: [TypeOrmModule, UsersService], 
})
export class UsersModule {}
