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
import { NotificationsModule } from './system/notifications/notifications.module';
import { TipoConversacionModule } from './new-chat/tipo-conversacion/tipo-conversacion.module';
import { ConversacionesModule } from './new-chat/conversacion/conversacion.module';
import { ParticipanteModule } from './new-chat/participante/participante.module';
import { MensajesModule } from './new-chat/mensaje/mensaje.module';


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
    NotificationsModule,
    TipoConversacionModule,
    ConversacionesModule,
    ParticipanteModule,
    MensajesModule,
  ],
})
export class AppModule {}
