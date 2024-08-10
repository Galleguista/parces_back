import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GruposService } from './grupos.service';
import { GruposController } from './grupos.controller';
import { ChatModule } from '../chat/chat.module'; // Importa el ChatModule
import { GrupoMiembro } from './entities/grupo-miembro.entity';
import { Grupo } from './entities/grupo.entity';
import { Usuario } from 'src/users/entity/usuario.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Grupo, GrupoMiembro]), ChatModule, UsersModule], 
  providers: [GruposService],
  controllers: [GruposController],
  exports: [GruposService],
})
export class GruposModule {}
