import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecursosService } from './recurso.service';
import { RecursosController } from './recurso.controller';
import { Recurso } from './entities/recurso.entity';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    TypeOrmModule.forFeature([Recurso]),
    MulterModule.register({
      dest: './uploads',
    }),
  ],
  providers: [RecursosService],
  controllers: [RecursosController],
})
export class RecursosModule {}
