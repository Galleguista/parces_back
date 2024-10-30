import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipoConversacionService } from './tipo-conversacion.service';
import { TipoConversacionController } from './tipo-conversacion.controller';
import { TipoConversacion } from './entities/tipo-conversacion.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TipoConversacion])],
  controllers: [TipoConversacionController],
  providers: [TipoConversacionService],
})
export class TipoConversacionModule {}
