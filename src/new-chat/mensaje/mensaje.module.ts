import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MensajeService } from './mensaje.service';
import { MensajeController } from './mensaje.controller';
import { Mensaje } from './entities/mensaje.entity';
import { UsersModule } from 'src/users/users.module';
import { MensajeGateway } from './mensaje.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([Mensaje]), UsersModule],
  controllers: [MensajeController],
  providers: [MensajeService, MensajeGateway],
  exports: [MensajeService]
})
export class MensajeModule {}
