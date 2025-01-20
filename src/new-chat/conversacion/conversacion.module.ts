import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConversacionService } from './conversacion.service';
import { ConversacionController } from './conversacion.controller';
import { Conversacion } from './entities/conversacion.entity';
import { Usuario } from 'src/users/entity/usuario.entity';
import { TipoConversacion } from '../tipo-conversacion/entities/tipo-conversacion.entity';
import { Grupo } from 'src/admin/grupos/entities/grupo.entity';
import { TipoConversacionService } from '../tipo-conversacion/tipo-conversacion.service';
import { UsersModule } from 'src/users/users.module';
import { Proyecto } from 'src/proyecto/entities/proyecto.entity';
import { TipoConversacionModule } from '../tipo-conversacion/tipo-conversacion.module';
import { ProyectoModule } from 'src/proyecto/proyecto.module';
import { Foro } from 'src/admin/foros/entities/foro.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Conversacion, 
      Usuario,
      TipoConversacion,
      Grupo,
      Proyecto,
      Foro
    ]),
    UsersModule,
    

  ],
  controllers: [ConversacionController],
  providers: [
    ConversacionService,
    TipoConversacionService,
  ],
  exports: [
    TypeOrmModule,
    ConversacionService, 
  ],
})
export class ConversacionModule {}
