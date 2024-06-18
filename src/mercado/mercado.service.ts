import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Item } from './entities/item.entity';
import { CreateItemDto } from './dto/create-item.dto';

@Injectable()
export class MercadoService {
  constructor(
    @InjectRepository(Item)
    private itemRepository: Repository<Item>,
  ) {}

  async createItem(createItemDto: CreateItemDto, usuarioId: string): Promise<Item> {
    const newItem = this.itemRepository.create({ ...createItemDto, usuario_id: usuarioId });
    return this.itemRepository.save(newItem);
  }

  async findAllItems(): Promise<Item[]> {
    return this.itemRepository.find();
  }
}
