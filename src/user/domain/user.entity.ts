import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BaseTimeEntity } from '../../common/model/base-time.entity';
import { UserStatus } from './user-status';
import { Generation } from './generation.entity';

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

  @Column({ type: 'array', name: 'role' })
  role: string[];

  @Column({ name: 'status', default: UserStatus.Candidate })
  status: string;

  @OneToOne(() => Generation, {
    nullable: true,
    eager: true,
  })
  @JoinColumn({ name: 'generation' })
  generation: Generation;
}
