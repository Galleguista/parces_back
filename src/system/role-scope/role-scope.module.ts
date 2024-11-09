import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleScopeService } from './role-scope.service';
import { RoleScopeController } from './role-scope.controller';
import { RoleScope } from './entities/role-scope.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RoleScope])],
  providers: [RoleScopeService],
  controllers: [RoleScopeController],
  exports: [RoleScopeService]
})
export class RoleScopeModule {}
