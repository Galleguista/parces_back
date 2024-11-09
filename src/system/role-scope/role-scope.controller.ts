import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { RoleScopeService } from './role-scope.service';
import { CreateRoleScopeDto } from './dto/create-role-scope.dto';

@Controller('role-scopes')
export class RoleScopeController {
  constructor(private readonly roleScopeService: RoleScopeService) {}

  @Post()
  create(@Body() createRoleScopeDto: CreateRoleScopeDto) {
    return this.roleScopeService.create(createRoleScopeDto);
  }

  @Get()
  findAll() {
    return this.roleScopeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roleScopeService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateRoleScopeDto: Partial<CreateRoleScopeDto>) {
    return this.roleScopeService.update(id, updateRoleScopeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roleScopeService.remove(id);
  }
}
