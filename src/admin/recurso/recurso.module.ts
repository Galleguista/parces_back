import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recurso } from './entities/recurso.entity';
import { RecursosService } from './recurso.service';
import { RecursosController } from './recurso.controller';



@Module({
  imports: [TypeOrmModule.forFeature([Recurso])],
  providers: [RecursosService],
  controllers: [RecursosController],
  exports: [RecursosService],
})
export class RecursoModule {}
