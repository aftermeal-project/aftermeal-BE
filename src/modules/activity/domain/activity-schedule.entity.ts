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
import { ActivityScheduleType } from './activity-schedule-type';
import { Participation } from '../../participation/domain/participation.entity';

@Entity()
export class ActivitySchedule extends BaseTimeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  dayOfWeek: DAY_OF_WEEK;

  @Column()
  type: ActivityScheduleType;

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
    timeSlot: ActivityScheduleType,
    activity: Activity,
  ): ActivitySchedule {
    const activitySchedule = new ActivitySchedule();
    activitySchedule.dayOfWeek = day;
    activitySchedule.type = timeSlot;
    activitySchedule.activity = activity;
    return activitySchedule;
  }
}
