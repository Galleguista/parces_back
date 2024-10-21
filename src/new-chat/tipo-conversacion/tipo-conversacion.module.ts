import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipoConversacion } from './entities/tipo-conversacion.entity';
import { TipoConversacionService } from './tipo-conversacion.service';
import { TipoConversacionController } from './tipo-conversacion.controller';

@Module({
    imports: [TypeOrmModule.forFeature([TipoConversacion])],
    providers: [TipoConversacionService],
    controllers: [TipoConversacionController],
})
export class TipoConversacionModule {}
