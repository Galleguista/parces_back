import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Proyecto } from './entities/proyecto.entity';
import { ProyectoService } from './proyecto.service';
import { ProyectoController } from './proyecto.controller';
import { ConversacionModule } from 'src/new-chat/conversacion/conversacion.module';
import { RoleScopeModule } from 'src/system/role-scope/role-scope.module';
import { UsersModule } from 'src/users/users.module';
import { BitacoraModule } from './bitacora/bitacora.module';
import { Bitacora } from './bitacora/entities/bitacora.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Proyecto, Bitacora]), ConversacionModule, RoleScopeModule, UsersModule, ],
  providers: [ProyectoService],
  controllers: [ProyectoController],
  exports: [TypeOrmModule, ProyectoService]
})
export class ProyectoModule {}
