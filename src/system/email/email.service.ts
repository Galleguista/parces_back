import { Injectable, NotFoundException } from '@nestjs/common';
import { SendgridService } from './sendgrid.service';
import * as handlebars from 'handlebars';
import { NotificationTemplateService } from 'src/notification-template/notification-template.service';
import { baseTemplate } from './templates/baseTemplate';

@Injectable()
export class EmailService {
  constructor(
    private readonly sendgridService: SendgridService,
    private readonly notificationTemplatesService: NotificationTemplateService,
  ) {}

  async sendNotificationByEmail(
    email: string,
    fallbackSubject: string,
    templateData: Record<string, any>,
    templateId?: string,
    attachments?: Array<{ filename: string; content: string; type: string }>,
  ): Promise<void> {
    let emailContent: string;
    let subject = fallbackSubject;
  
    if (templateId) {
      const template = await this.notificationTemplatesService.findOne(templateId);
      if (!template) {
        throw new NotFoundException(`Template con ID "${templateId}" no encontrado`);
      }
  
      subject = template.subject || fallbackSubject;
  
      const compiledDynamicTemplate = handlebars.compile(template.content);
      const dynamicContent = compiledDynamicTemplate(templateData);
  
      const compiledBaseTemplate = handlebars.compile(baseTemplate);
      emailContent = compiledBaseTemplate({ content: dynamicContent });
    } else {
      emailContent = templateData.message;
    }
  
    try {
      await this.sendgridService.send(email, emailContent, subject, attachments);
    } catch (error) {
      console.error('Error al enviar el correo:', error);
    }
  }  
}
