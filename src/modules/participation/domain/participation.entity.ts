import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { BaseTimeEntity } from '@common/model/base-time.entity';
import { User } from '../../user/domain/user.entity';
import { Activity } from '../../activity/domain/activity.entity';

@Entity()
export class Participation extends BaseTimeEntity {
  @PrimaryColumn()
  userId: number;

  @PrimaryColumn()
  activityId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Activity)
  @JoinColumn({ name: 'activity_id' })
  activity: Activity;
}
