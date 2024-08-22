import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MensajeService } from './mensaje.service';
import { MensajeController } from './mensaje.controller';
import { Mensaje } from './entities/mensaje.entity';
import { Chat } from '../entities/chat.entity';
import { Usuario } from 'src/users/entity/usuario.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Mensaje, Chat, Usuario])],
    controllers: [MensajeController],
    providers: [MensajeService],
    exports: [MensajeService],
})
export class MensajeModule {}
