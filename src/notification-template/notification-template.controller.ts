import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { NotificationTemplateService } from './notification-template.service';
import { CreateNotificationTemplateDto } from './dto/create-notification-template.dto';
import { UpdateNotificationTemplateDto } from './dto/update-notification-template.dto';

@Controller('notification-template')
export class NotificationTemplateController {
  constructor(private readonly notificationTemplateService: NotificationTemplateService) {}

  @Post()
  create(@Body() createNotificationTemplateDto: CreateNotificationTemplateDto) {
    return this.notificationTemplateService.create(createNotificationTemplateDto);
  }

  // @Get()
  // findAll() {
  //   return this.notificationTemplateService.findAll();
  // }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.notificationTemplateService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.notificationTemplateService.remove(id);
  }
}
