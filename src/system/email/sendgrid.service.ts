import { Injectable } from '@nestjs/common';
import * as sgMail from '@sendgrid/mail';
import axios from 'axios';

@Injectable()
export class SendgridService {
  private readonly apiUrl = 'https://api.sendgrid.com/v3';

  constructor() {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    if (!process.env.SENDGRID_API_KEY) {
      throw new Error('El valor de SENDGRID_API_KEY no está configurado en el entorno.');
    }
  }

  private getHeaders() {
    return {
      Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`,
      'Content-Type': 'application/json',
    };
  }

  async send(
    to: string,
    htmlContent: string,
    subject: string,
    attachments?: Array<{ filename: string; content: string; type: string }>,
  ): Promise<void> {
    const msg: any = {
      to,
      from: {
        email: 'juandagallego.dev@gmail.com',
        name: 'Parces Agronaptic',
      },
      subject,
      html: htmlContent,
    };

    if (attachments && attachments.length > 0) {
      msg.attachments = attachments.map((att) => ({
        filename: att.filename,
        content: att.content,
        type: att.type,
        disposition: 'attachment',
      }));
    }

    try {
      await sgMail.send(msg);
    } catch (error) {
      const errorMessage = error.response?.body?.errors?.[0]?.message || 'Error desconocido al enviar el correo.';
      throw new Error(`Error al enviar correo: ${errorMessage}`);
    }
  }

  async createContactList(name: string): Promise<string> {
    if (!name || name.trim() === '') {
      throw new Error('El nombre de la lista no puede estar vacío.');
    }

    const url = `${this.apiUrl}/marketing/lists`;
    const payload = { name };

    try {
      const response = await axios.post(url, payload, { headers: this.getHeaders() });
      return response.data.id;
    } catch (error) {
      const errorMessage = error.response?.data?.errors?.[0]?.message || 'Error desconocido al crear la lista.';
      throw new Error(`Error al crear lista de contactos: ${errorMessage}`);
    }
  }

  async addContactsToList(contacts: Array<{ email: string; first_name?: string; last_name?: string }>): Promise<void> {
    if (!contacts || contacts.length === 0) {
      throw new Error('La lista de contactos no puede estar vacía.');
    }

    const url = `${this.apiUrl}/marketing/contacts`;
    const payload = { contacts };

    try {
      await axios.put(url, payload, { headers: this.getHeaders() });
    } catch (error) {
      const errorMessage = error.response?.data?.errors?.[0]?.message || 'Error desconocido al agregar contactos.';
      throw new Error(`Error al agregar contactos: ${errorMessage}`);
    }
  }

  async createCampaign(
    name: string,
    listId: string,
    subject: string,
    senderId: number,
    htmlContent: string,
  ): Promise<string> {
    const url = `${this.apiUrl}/marketing/singlesends`;
    const payload = {
      name,
      send_to: { list_ids: [listId] },
      email_config: {
        subject,
        sender_id: senderId,
        html_content: htmlContent,
      },
    };

    try {
      const response = await axios.post(url, payload, { headers: this.getHeaders() });
      return response.data.id;
    } catch (error) {
      const errorMessage = error.response?.data?.errors?.[0]?.message || 'Error desconocido al crear la campaña.';
      throw new Error(`Error al crear campaña: ${errorMessage}`);
    }
  }

  async sendCampaign(campaignId: string): Promise<void> {
    const url = `${this.apiUrl}/marketing/singlesends/${campaignId}/schedule`;
    const payload = { send_at: 'now' };

    try {
      await axios.post(url, payload, { headers: this.getHeaders() });
    } catch (error) {
      const errorMessage = error.response?.data?.errors?.[0]?.message || 'Error desconocido al enviar la campaña.';
      throw new Error(`Error al enviar campaña: ${errorMessage}`);
    }
  }

  async getCampaignMetrics(campaignId: string): Promise<any> {
    const url = `${this.apiUrl}/marketing/stats/singlesends/${campaignId}`;

    try {
      const response = await axios.get(url, { headers: this.getHeaders() });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.errors?.[0]?.message || 'Error desconocido al obtener métricas.';
      throw new Error(`Error al obtener métricas de la campaña: ${errorMessage}`);
    }
  }
}
