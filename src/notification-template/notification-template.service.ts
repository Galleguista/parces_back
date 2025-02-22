import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { instanceToPlain } from 'class-transformer';
import { CreateNotificationTemplateDto } from './dto/create-notification-template.dto';
import { NotificationTemplate } from './entities/notification-template.entity';

@Injectable()
export class NotificationTemplateService {
  constructor(
    @InjectRepository(NotificationTemplate)
    private templatesRepository: Repository<NotificationTemplate>,
  ) {}

  async create(createTemplateDto: CreateNotificationTemplateDto): Promise<any> {
    const template = new NotificationTemplate();
    template.notemp_name = createTemplateDto.name;
    template.notemp_content = createTemplateDto.content;

    const savedTemplate = await this.templatesRepository.save(template);
    return instanceToPlain(savedTemplate);
  }

  async findOne(id: string): Promise<any> {
    const template = await this.templatesRepository.findOne({ where: { notemp_id: id } });
    if (!template) {
      throw new NotFoundException(`Template with ID ${id} not found`);
    }
    return instanceToPlain(template);
  }  


  // async findAll(page: string | number, orderDirection: 'ASC' | 'DESC') {
  //   const limit = 25;
  //   const orderFields = {
  //     notemp_id: orderDirection,
  //   };

  //   return paginate(this.templatesRepository, { page, limit, orderFields });
  // }


  async remove(id: string): Promise<void> {
    const deleteResult = await this.templatesRepository.delete(id);
    if (deleteResult.affected === 0) {
      throw new NotFoundException(`Template with ID ${id} not found`);
    }
  }
}
