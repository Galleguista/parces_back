import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { Chat } from './entities/chat.entity';
import { Mensaje } from './mensaje/entities/mensaje.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Chat, Mensaje]), UsersModule],
  providers: [ChatService],
  controllers: [ChatController],
  exports: [TypeOrmModule],
})
export class ChatModule {}
