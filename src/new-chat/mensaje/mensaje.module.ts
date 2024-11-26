import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MensajeController } from './mensaje.controller';
import { MensajeService } from './mensaje.service';
import { MensajeGateway } from './mensaje.gateway';
import { Mensaje } from './entities/mensaje.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Mensaje]), // Configurar entidad Mensaje
    UsersModule, // Usuarios asociados al sistema
  ],
  controllers: [MensajeController], // Controladores HTTP
  providers: [MensajeService, MensajeGateway], // Proveedores dentro del módulo
  exports: [MensajeService], // Exportar MensajeService si lo necesitan otros módulos
})
export class MensajeModule {}
