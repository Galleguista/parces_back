import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MuroService } from './muro.service';
import { MuroController } from './muro.controller';
import { Publicacion } from './entities/publicacion.entity';
import { UsersModule } from 'src/users/users.module';


@Module({
  imports: [
    TypeOrmModule.forFeature([Publicacion]),
    UsersModule,
  ],
  providers: [MuroService],
  controllers: [MuroController],
})
export class MuroModule {}
