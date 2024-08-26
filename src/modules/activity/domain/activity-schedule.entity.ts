import { BaseTimeEntity } from '@common/models/base-time.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Activity } from './activity.entity';
import { DAY_OF_WEEK } from './day-of-week';
import { TimeSlot } from './time-slot';
import { Participation } from '../../participation/domain/participation.entity';

@Entity()
export class ActivitySchedule extends BaseTimeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  dayOfWeek: DAY_OF_WEEK;

  @Column()
  timeSlot: TimeSlot;

  @ManyToOne(() => Activity)
  @JoinColumn({
    name: 'activity_id',
    foreignKeyConstraintName: 'fk_activity_schedule_activity',
  })
  activity: Activity;

  @OneToMany(
    () => Participation,
    (participation) => participation.activitySchedule,
  )
  participation: Participation[];

  static create(
    day: DAY_OF_WEEK,
    timeSlot: TimeSlot,
    activity: Activity,
  ): ActivitySchedule {
    const activitySchedule = new ActivitySchedule();
    activitySchedule.dayOfWeek = day;
    activitySchedule.timeSlot = timeSlot;
    activitySchedule.activity = activity;
    return activitySchedule;
  }
}
