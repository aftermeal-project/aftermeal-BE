import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../user/entity/user.entity';
import { Activity } from '../../activity/entity/activity.entity';
import { BaseTimeEntity } from '../../../global/entity/base-time.entity';

@Entity()
export class Participate extends BaseTimeEntity {
  @PrimaryGeneratedColumn({ name: 'participate_id' })
  participateId: number;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Activity, { nullable: false, cascade: true })
  @JoinColumn({ name: 'selected_activity_id' })
  activity: Activity;
}
