import { Module } from '@nestjs/common';
import { RespuestasService } from './respuestas.service';
import { RespuestasController } from './respuestas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Respuestas } from './entities/respuesta.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Respuestas])],
  controllers: [RespuestasController],
  providers: [RespuestasService],
})
export class RespuestasModule {}
