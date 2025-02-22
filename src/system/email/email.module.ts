import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';
import { Email } from './entities/email.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationTemplateService } from 'src/notification-template/notification-template.service';
import { SendgridService } from './sendgrid.service';
import { NotificationTemplate } from 'src/notification-template/entities/notification-template.entity';
import { NotificationTemplateModule } from 'src/notification-template/notification-template.module';

@Module({
  imports: [TypeOrmModule.forFeature([NotificationTemplate]), NotificationTemplateModule],
  controllers: [EmailController],
  providers: [EmailService, NotificationTemplateService, SendgridService],
})
export class EmailModule {}
