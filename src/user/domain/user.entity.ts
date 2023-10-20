import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseTimeEntity } from '../../common/model/base-time.entity';
import { UserStatus } from './user-status';

@Entity()
export class User extends BaseTimeEntity {
  @PrimaryGeneratedColumn({ name: 'user_id' })
  id: number;

  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'email', unique: true })
  email: string;

  @Column({ name: 'type' })
  type: string;

  @Column({ name: 'generation', nullable: true })
  generation?: number | null;

  @Column({ type: 'array', name: 'role' })
  role: string[];

  @Column({ name: 'status', default: UserStatus.Candidate })
  status: string;
}
