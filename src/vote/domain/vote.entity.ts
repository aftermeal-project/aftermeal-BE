import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BaseTimeEntity } from '../../common/model/base-time.entity';
import { User } from '../../user/domain/user.entity';
import { Activity } from '../../activity/domain/activity.entity';

@Entity()
export class Vote extends BaseTimeEntity {
  @PrimaryGeneratedColumn({ name: 'vote_id' })
  id: number;

  @ManyToOne(() => User, {
    cascade: true,
    lazy: true,
  })
  @JoinColumn({ name: 'user_id' })
  user: Promise<User>;

  @ManyToOne(() => Activity, {
    cascade: true,
    lazy: true,
  })
  @JoinColumn({ name: 'activity_id' })
  activity: Promise<Activity>;
}
