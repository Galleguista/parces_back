import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { CreateRoleDto } from './dto/create-role.dto';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    const role = this.roleRepository.create(createRoleDto);
    return this.roleRepository.save(role);
  }

  async findRoleByUserId(userId: string): Promise<Role | undefined> {

    return this.roleRepository
      .createQueryBuilder('role')
      .innerJoin('user_role', 'userRole', 'userRole.role_id = role.role_id')
      .where('userRole.user_id = :userId', { userId })
      .getOne();
  }

  // async findRoleDetailsById(roleId: string): Promise<Role> {
  //   return this.roleRepository
  //     .createQueryBuilder('role')
  //     .leftJoinAndSelect('scope', 'scope', 'scope.role_id = role.role_id') // Asumiendo que `scope` tiene una columna `role_id`
  //     .where('role.role_id = :roleId', { roleId })
  //     .getOne();
  // }

  async findAll(): Promise<Role[]> {
    return this.roleRepository.find();
  }

  async findOne(id: string): Promise<Role> {
    return this.roleRepository.findOne({ where: { role_id: id } });
  }

  async update(id: string, updateRoleDto: Partial<CreateRoleDto>): Promise<void> {
    await this.roleRepository.update(id, updateRoleDto);
  }

  async remove(id: string): Promise<void> {
    await this.roleRepository.delete(id);
  }
}
