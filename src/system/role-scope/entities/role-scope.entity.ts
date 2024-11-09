import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('role_scope', { schema: 'admin' })
export class RoleScope {
  @PrimaryGeneratedColumn('uuid')
  rolsco_id: string;

  @Column({ type: 'uuid' })
  role_id: string;

  @Column({ type: 'uuid' })
  scope_id: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'varchar', length: 100, nullable: true })
  last_updated_by_db_user: string;

  @Column({ type: 'bigint', nullable: true })
  last_updated_by: number;

  @Column({ type: 'timestamp', nullable: true })
  updated_at: Date;
}
