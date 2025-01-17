import { Module } from '@nestjs/common';
import { PostulacionesService } from './postulaciones.service';
import { PostulacionesController } from './postulaciones.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Postulaciones } from './entities/postulacione.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Postulaciones])],
  controllers: [PostulacionesController],
  providers: [PostulacionesService],
})
export class PostulacionesModule {}
