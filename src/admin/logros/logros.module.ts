import { Module } from '@nestjs/common';
import { LogrosService } from './logros.service';
import { LogrosController } from './logros.controller';
import { Logro } from './entities/logro.entity';
import { RecursosService } from '../recurso/recurso.service';
import { RecursosController } from '../recurso/recurso.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Logro])],
  providers: [LogrosService],
  controllers: [LogrosController],
  exports: [LogrosService],
})
export class LogrosModule {}
