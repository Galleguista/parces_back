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

@Module({
  imports: [
    TypeOrmModule.forFeature([Proyecto, Bitacora, Formulario, Postulaciones, Respuestas]),
    ConversacionModule,
    RoleScopeModule,
    UsersModule,
  ],
  providers: [ProyectoService],
  controllers: [ProyectoController],
  exports: [TypeOrmModule, ProyectoService],
})
export class ProyectoModule {}
