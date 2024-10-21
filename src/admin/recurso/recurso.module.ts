import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecursosService } from './recurso.service';
import { RecursosController } from './recurso.controller';
import { Recurso } from './entities/recurso.entity';
import { MulterModule } from '@nestjs/platform-express';
import { FilesModule } from 'src/system/files/files.module';
import { FilesService } from 'src/system/files/files.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Recurso]),
    FilesModule
  ],
  providers: [RecursosService, FilesService],
  controllers: [RecursosController],
})
export class RecursosModule {}
