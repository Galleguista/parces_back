import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Proyecto } from './entities/proyecto.entity';
import { ProyectoService } from './proyecto.service';
import { ProyectoController } from './proyecto.controller';
import { ConversacionModule } from 'src/new-chat/conversacion/conversacion.module';

@Module({
  imports: [TypeOrmModule.forFeature([Proyecto]), ConversacionModule],
  providers: [ProyectoService],
  controllers: [ProyectoController],
})
export class ProyectoModule {}
