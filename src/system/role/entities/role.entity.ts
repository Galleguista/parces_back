import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('role', { schema: 'admin' })
export class Role {
  @PrimaryGeneratedColumn('uuid')
  role_id: string;

  @Column({ type: 'varchar', length: 200 })
  role_name: string;

  @Column({ type: 'varchar', length: 5000, nullable: true })
  role_description: string;

  @Column({ type: 'boolean', default: true })
  role_status: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'varchar', length: 100, nullable: true })
  last_updated_by_db_user: string;

  @Column({ type: 'bigint', nullable: true })
  last_updated_by: number;

  @Column({ type: 'timestamp', nullable: true })
  updated_at: Date;
}
