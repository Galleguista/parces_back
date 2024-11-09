import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { ScopeService } from './scope.service';
import { CreateScopeDto } from './dto/create-scope.dto';

@Controller('scopes')
export class ScopeController {
  constructor(private readonly scopeService: ScopeService) {}

  @Post()
  create(@Body() createScopeDto: CreateScopeDto) {
    return this.scopeService.create(createScopeDto);
  }

  @Get()
  findAll() {
    return this.scopeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.scopeService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateScopeDto: Partial<CreateScopeDto>) {
    return this.scopeService.update(id, updateScopeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.scopeService.remove(id);
  }
}
