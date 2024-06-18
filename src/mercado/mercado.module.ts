import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MercadoService } from './mercado.service';
import { MercadoController } from './mercado.controller';
import { Item } from './entities/item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Item])],
  providers: [MercadoService],
  controllers: [MercadoController],
})
export class MercadoModule {}
