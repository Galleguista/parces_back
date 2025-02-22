import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProyectoModule } from './proyecto/proyecto.module';
import { MercadoModule } from './mercado/mercado.module';
import { MuroModule } from './admin/muro/muro.module';
import { ProfileModule } from './admin/profile/profile.module';
import { GrupoModule } from './admin/grupos/grupos.module';
import { RecursosModule } from './admin/recurso/recurso.module';
import { LogrosModule } from './admin/logros/logros.module';
import { ForosModule } from './admin/foros/foros.module';
import { EventosModule } from './admin/eventos/eventos.module';
import { FilesModule } from './system/files/files.module';
import { TipoConversacionModule } from './new-chat/tipo-conversacion/tipo-conversacion.module';
import { ConversacionModule } from './new-chat/conversacion/conversacion.module';
import { MensajeModule } from './new-chat/mensaje/mensaje.module';
import { RoleModule } from './system/role/role.module';
import { ScopeModule } from './system/scope/scope.module';
import { RoleScopeModule } from './system/role-scope/role-scope.module';
import { UserRoleModule } from './system/user-role/user-role.module';
import { NotificacionesModule } from './system/notificaciones/notificaciones.module';
import { EmailModule } from './system/email/email.module';
import { NotificationTemplateModule } from './notification-template/notification-template.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DATABASE_HOST'),
        port: configService.get<number>('DATABASE_PORT'),
        username: configService.get<string>('DATABASE_USERNAME'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: configService.get<string>('DATABASE_NAME'),
        autoLoadEntities: true,
        synchronize: false,
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    ProyectoModule,
    MercadoModule,
    MuroModule,
    ProfileModule,
    GrupoModule,
    RecursosModule,
    LogrosModule,
    ForosModule,
    EventosModule,
    FilesModule,
    TipoConversacionModule,
    ConversacionModule,
    MensajeModule,
    RoleModule,
    ScopeModule,
    RoleScopeModule,
    UserRoleModule,
    NotificacionesModule,
    EmailModule,
    NotificationTemplateModule,
  ],
})
export class AppModule {}
