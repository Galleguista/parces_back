import { Module } from '@nestjs/common';
import { ForosService } from './foros.service';
import { ForosController } from './foros.controller';
import { Foro } from './entities/foro.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

export @Module({
  imports: [TypeOrmModule.forFeature([Foro])],
  providers: [ForosService],
  controllers: [ForosController],
  exports: [ForosService],
})class ForosModule {}
