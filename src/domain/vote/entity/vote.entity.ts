import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BaseTimeEntity } from '../../../global/entity/base-time.entity';
import { User } from '../../user/entity/user.entity';
import { Activity } from '../../activity/entity/activity.entity';

@Entity()
export class Vote extends BaseTimeEntity {
  @PrimaryGeneratedColumn({ name: 'vote_id' })
  voteId: number;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Activity, { nullable: false, cascade: true })
  @JoinColumn({ name: 'activity_id' })
  activity: Activity;
}
