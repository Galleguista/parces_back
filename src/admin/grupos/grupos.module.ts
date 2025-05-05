import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Grupo } from './entities/grupo.entity';
import { GrupoController } from './grupos.controller';
import { GrupoService } from './grupos.service';
import { UsersModule } from 'src/users/users.module';
import { ConversacionModule } from 'src/new-chat/conversacion/conversacion.module';
import { Usuario } from 'src/users/entity/usuario.entity';
import { ChatModule } from 'src/chat/chat.module';

@Module({
  imports: [TypeOrmModule.forFeature([Grupo, Usuario]), ConversacionModule, ChatModule],
  controllers: [GrupoController],
  providers: [GrupoService],
})
export class GrupoModule {}
