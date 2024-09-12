import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BaseTimeEntity } from '@common/models/base-time.entity';
import { User } from '../../../user/domain/entities/user.entity';
import { Activity } from '../../../activity/domain/entities/activity.entity';

@Entity()
export class Participation extends BaseTimeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({
    name: 'user_id',
    foreignKeyConstraintName: 'fk_participation_user',
  })
  user: User;

  @ManyToOne(() => Activity, (activity) => activity.participations, {
    lazy: true,
  })
  @JoinColumn({
    name: 'activity_id',
    foreignKeyConstraintName: 'fk_participation_activity',
  })
  activity: Promise<Activity>;

  static create(user: User, activity: Activity): Participation {
    const participation = new Participation();
    participation.user = user;
    participation.activity = Promise.resolve(activity);
    return participation;
  }
}
