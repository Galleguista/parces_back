import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MuroService } from './muro.service';
import { MuroController } from './muro.controller';
import { Publicacion } from './entities/publicacion.entity';
import { UsersModule } from 'src/users/users.module';
import { FilesService } from 'src/system/files/files.service';


@Module({
  imports: [
    TypeOrmModule.forFeature([Publicacion]),
    UsersModule,
  ],
  providers: [MuroService, FilesService],
  controllers: [MuroController],
})
export class MuroModule {}
