import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { Chat } from './entities/chat.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Chat])],
  providers: [ChatService],
  controllers: [ChatController],
  exports: [ChatService, TypeOrmModule], // Exporta TypeOrmModule para permitir el acceso al ChatRepository
})
export class ChatModule {}
