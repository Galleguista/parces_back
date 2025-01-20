import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Proyecto } from './entities/proyecto.entity';
import { ProyectoService } from './proyecto.service';
import { ProyectoController } from './proyecto.controller';
import { ConversacionModule } from 'src/new-chat/conversacion/conversacion.module';
import { RoleScopeModule } from 'src/system/role-scope/role-scope.module';
import { UsersModule } from 'src/users/users.module';
import { Bitacora } from './bitacora/entities/bitacora.entity';
import { Formulario } from './administracion/formularios/entities/formulario.entity';
import { Postulaciones } from './administracion/postulaciones/entities/postulacione.entity';
import { Respuestas } from './administracion/respuestas/entities/respuesta.entity';
import { NotificacionesModule } from 'src/system/notificaciones/notificaciones.module';
import { Notificacion } from 'src/system/notificaciones/entities/notificacione.entity';
import { NotificacionesService } from 'src/system/notificaciones/notificaciones.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Proyecto, Bitacora, Formulario, Postulaciones, Respuestas, Notificacion]),
    ConversacionModule,
    RoleScopeModule,
    UsersModule,
    NotificacionesModule
  ],
  providers: [ProyectoService, NotificacionesService],
  controllers: [ProyectoController],
  exports: [TypeOrmModule, ProyectoService],
})
export class ProyectoModule {}
