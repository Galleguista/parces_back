import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chat } from './entities/chat.entity';
import { CreateChatDto } from './dto/create-chat.dto';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat)
    private chatRepository: Repository<Chat>,
  ) {}

  async createChat(createChatDto: CreateChatDto): Promise<Chat> {
    const newChat = this.chatRepository.create(createChatDto);
    return this.chatRepository.save(newChat);
  }

  async getChats(): Promise<Chat[]> {
    return this.chatRepository.find({ relations: ['mensajes'] });
  }
}
