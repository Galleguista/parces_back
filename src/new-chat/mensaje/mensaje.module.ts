import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mensaje } from './entities/mensaje.entity';


import { ChatGateway } from './chat.gateway';
import { MensajeController } from './mensaje.controller';
import { AuthModule } from 'src/auth/auth.module';
import { MensajeService } from './mensaje.service';


@Module({
  imports: [TypeOrmModule.forFeature([Mensaje]), AuthModule],
  providers: [MensajeService, ChatGateway],
  controllers: [MensajeController],
})
export class MensajesModule {}
