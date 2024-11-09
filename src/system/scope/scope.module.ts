import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScopeService } from './scope.service';
import { ScopeController } from './scope.controller';
import { Scope } from './entities/scope.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Scope])],
  providers: [ScopeService],
  controllers: [ScopeController],
})
export class ScopeModule {}
