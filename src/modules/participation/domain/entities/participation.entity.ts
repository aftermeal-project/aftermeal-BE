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
    eager: false,
  })
  @JoinColumn({
    name: 'activity_id',
    foreignKeyConstraintName: 'fk_participation_activity',
  })
  activity: Activity;

  isOwnedBy(user: User): boolean {
    return this.user.id === user.id;
  }
}
