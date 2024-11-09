import { PartialType } from '@nestjs/swagger';
import { CreateRoleScopeDto } from './create-role-scope.dto';

export class UpdateRoleScopeDto extends PartialType(CreateRoleScopeDto) {}
