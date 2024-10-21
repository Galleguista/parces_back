import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Conversacion } from './entities/conversacion.entity';
import { ConversacionesService } from './conversacion.service';
import { ConversacionesController } from './conversacion.controller';


@Module({
    imports: [TypeOrmModule.forFeature([Conversacion])],
    providers: [ConversacionesService],
    controllers: [ConversacionesController],
})
export class ConversacionesModule {}
