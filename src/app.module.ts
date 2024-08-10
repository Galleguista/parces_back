import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProyectoModule } from './proyecto/proyecto.module';
import { MercadoModule } from './mercado/mercado.module';
import { MuroModule } from './admin/muro/muro.module';
import { ProfileModule } from './admin/profile/profile.module';
import { ChatModule } from './admin/chat/chat.module';
import { GruposModule } from './admin/grupos/grupos.module';
import { RecursosModule } from './admin/recurso/recurso.module';
import { LogrosModule } from './admin/logros/logros.module';
import { ForosModule } from './admin/foros/foros.module';
import { EventosModule } from './admin/eventos/eventos.module';
import { AmigosModule } from './admin/chat/amigos/amigos.module';


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
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    ProyectoModule,
    MercadoModule,
    MuroModule,
    ProfileModule,
    ChatModule,
    GruposModule,
    RecursosModule,
    LogrosModule,
    ForosModule,
    EventosModule,
    AmigosModule,
  ],
})
export class AppModule {}
