import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConversacionService } from './conversacion.service';
import { ConversacionController } from './conversacion.controller';
import { Conversacion } from './entities/conversacion.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Conversacion])],
  controllers: [ConversacionController],
  providers: [ConversacionService],
  exports: [TypeOrmModule]
})
export class ConversacionModule {}
