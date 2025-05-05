import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { Conversacion } from './entities/conversacion.entity';
import { TipoConversacion } from './entities/tipo_conversacion.entity';
import { UsuarioConversacion } from './entities/usuario_conversacion.entity';
import { Mensaje } from './entities/mensaje_adjunto.entity';
import { MensajeAdjunto } from './entities/mensaje.entity';
import { Usuario } from 'src/users/entity/usuario.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [
        Conversacion,
        Mensaje,
        MensajeAdjunto,
        TipoConversacion,
        UsuarioConversacion,
        Usuario
      ],
    ),
  ],
  providers: [ChatGateway, ChatService],
  exports: [ChatService],
})
export class ChatModule {}
