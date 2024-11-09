import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoleScope } from './entities/role-scope.entity';
import { CreateRoleScopeDto } from './dto/create-role-scope.dto';

@Injectable()
export class RoleScopeService {
  constructor(
    @InjectRepository(RoleScope)
    private readonly roleScopeRepository: Repository<RoleScope>,
  ) {}

  async create(createRoleScopeDto: CreateRoleScopeDto): Promise<RoleScope> {
    const roleScope = this.roleScopeRepository.create(createRoleScopeDto);
    return this.roleScopeRepository.save(roleScope);
  }

  async findScopesByRoleId(roleId: string): Promise<string[]> {
    // Busca los permisos asociados al `role_id`
    const roleScopes = await this.roleScopeRepository.find({ where: { role_id: roleId } });
    return roleScopes.map(roleScope => roleScope.scope_id); // Devuelve una lista de `scope_id`
  }

  async findAll(): Promise<RoleScope[]> {
    return this.roleScopeRepository.find();
  }

  async findOne(id: string): Promise<RoleScope> {
    return this.roleScopeRepository.findOne({ where: { rolsco_id: id } });
  }

  async update(id: string, updateRoleScopeDto: Partial<CreateRoleScopeDto>): Promise<void> {
    await this.roleScopeRepository.update(id, updateRoleScopeDto);
  }

  async remove(id: string): Promise<void> {
    await this.roleScopeRepository.delete(id);
  }
}
