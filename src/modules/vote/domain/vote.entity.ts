import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseTimeEntity } from '@common/model/base-time.entity';
import { User } from '../../user/domain/user.entity';
import { ActivityInfo } from '../../activity/domain/activity-info.entity';

@Entity()
export class Vote extends BaseTimeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  activityId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => ActivityInfo)
  @JoinColumn({ name: 'activity_id' })
  activity: ActivityInfo;
}
