import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BaseTimeEntity } from '@common/models/base-time.entity';
import { User } from '../../user/domain/user.entity';
import { ActivitySchedule } from '../../activity/domain/entities/activity-schedule.entity';

@Entity()
export class Participation extends BaseTimeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  @JoinColumn({
    name: 'user_id',
    foreignKeyConstraintName: 'fk_participation_user',
  })
  user: User;

  @ManyToOne(() => ActivitySchedule)
  @JoinColumn({
    name: 'activity_schedule_id',
    foreignKeyConstraintName: 'fk_participation_activity_schedule',
  })
  activitySchedule: ActivitySchedule;

  static create(user: User, activitySchedule: ActivitySchedule) {
    const participation = new Participation();
    participation.user = user;
    participation.activitySchedule = activitySchedule;
    return participation;
  }
}
