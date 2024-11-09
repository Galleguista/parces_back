import { PartialType } from '@nestjs/swagger';
import { CreateScopeDto } from './create-scope.dto';

export class UpdateScopeDto extends PartialType(CreateScopeDto) {}
