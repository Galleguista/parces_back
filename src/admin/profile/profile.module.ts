import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { Usuario } from 'src/users/entity/usuario.entity';
import { FilesService } from 'src/system/files/files.service';

@Module({
  imports: [TypeOrmModule.forFeature([Usuario])],
  providers: [ProfileService, FilesService],
  controllers: [ProfileController],
})
export class ProfileModule {}
