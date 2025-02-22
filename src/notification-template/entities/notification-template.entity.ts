import { Expose } from 'class-transformer';
import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn } from 'typeorm';

@Entity('notification_template', { schema: 'admin' })
export class NotificationTemplate {

    @PrimaryColumn()
    @Expose({ name: 'id' })
    notemp_id: string;

    @Column()
    @Expose({ name: 'template_name' })
    notemp_name: string;

    @Column()
    @Expose({ name: 'content' })
    notemp_content: string;

    @Column()
    @Expose({ name: 'subject' })
    notemp_subject: string;

}
