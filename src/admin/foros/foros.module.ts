import { Module } from '@nestjs/common';
import { ForosService } from './foros.service';
import { ForosController } from './foros.controller';
import { Foro } from './entities/foro.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConversacionModule } from 'src/new-chat/conversacion/conversacion.module';

export @Module({
  imports: [TypeOrmModule.forFeature([Foro]),ConversacionModule],
  providers: [ForosService],
  controllers: [ForosController],
})class ForosModule {}
