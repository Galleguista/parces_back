import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Scope } from './entities/scope.entity';
import { CreateScopeDto } from './dto/create-scope.dto';

@Injectable()
export class ScopeService {
  constructor(
    @InjectRepository(Scope)
    private readonly scopeRepository: Repository<Scope>,
  ) {}

  async create(createScopeDto: CreateScopeDto): Promise<Scope> {
    const scope = this.scopeRepository.create(createScopeDto);
    return this.scopeRepository.save(scope);
  }

  async findAll(): Promise<Scope[]> {
    return this.scopeRepository.find();
  }

  async findOne(id: string): Promise<Scope> {
    return this.scopeRepository.findOne({ where: { scope_id: id } });
  }

  async update(id: string, updateScopeDto: Partial<CreateScopeDto>): Promise<void> {
    await this.scopeRepository.update(id, updateScopeDto);
  }

  async remove(id: string): Promise<void> {
    await this.scopeRepository.delete(id);
  }
}
