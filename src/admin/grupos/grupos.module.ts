import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GruposService } from './grupos.service';
import { GruposController } from './grupos.controller';
import { ChatModule } from '../chat/chat.module';
import { GrupoMiembro } from './entities/grupo-miembro.entity';
import { Grupo } from './entities/grupo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Grupo, GrupoMiembro]), ChatModule],
  providers: [GruposService],
  controllers: [GruposController],
  exports: [GruposService],
})
export class GruposModule {}
