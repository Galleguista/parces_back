import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Amigo } from './entities/amigo.entity';
import { AmigosService } from './amigos.service';
import { AmigosController } from './amigos.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Amigo])],
  providers: [AmigosService],
  controllers: [AmigosController],
  exports: [AmigosService],
})
export class AmigosModule {}
