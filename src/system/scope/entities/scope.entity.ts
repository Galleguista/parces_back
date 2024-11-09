import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('scope', { schema: 'admin' })
export class Scope {
  @PrimaryGeneratedColumn('uuid')
  scope_id: string;

  @Column({ type: 'varchar', length: 200 })
  scope_name: string;

  @Column({ type: 'varchar', length: 5000, nullable: true })
  scope_description: string;

  @Column({ type: 'varchar', length: 1000, nullable: true })
  scope_ip_restriction: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  scope_path: string;

  @Column({ type: 'boolean', default: false })
  scope_visible: boolean;

  @Column({ type: 'varchar', length: 100, nullable: true })
  scope_icon: string;

  @Column({ type: 'boolean', default: true })
  scope_status: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'varchar', length: 100, nullable: true })
  last_updated_by_db_user: string;

  @Column({ type: 'bigint', nullable: true })
  last_updated_by: number;

  @Column({ type: 'timestamp', nullable: true })
  updated_at: Date;
}
