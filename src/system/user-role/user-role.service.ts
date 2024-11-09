import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRole } from './entities/user-role.entity';
import { CreateUserRoleDto } from './dto/create-user-role.dto';

@Injectable()
export class UserRoleService {
  constructor(
    @InjectRepository(UserRole)
    private readonly userRoleRepository: Repository<UserRole>,
  ) {}

  async create(createUserRoleDto: CreateUserRoleDto): Promise<UserRole> {
    const userRole = this.userRoleRepository.create(createUserRoleDto);
    return this.userRoleRepository.save(userRole);
  }

  async findAll(): Promise<UserRole[]> {
    return this.userRoleRepository.find();
  }

  async findOne(id: string): Promise<UserRole> {
    return this.userRoleRepository.findOne({ where: { userol_id: id } });
  }

  async update(id: string, updateUserRoleDto: Partial<CreateUserRoleDto>): Promise<void> {
    await this.userRoleRepository.update(id, updateUserRoleDto);
  }

  async remove(id: string): Promise<void> {
    await this.userRoleRepository.delete(id);
  }
}
