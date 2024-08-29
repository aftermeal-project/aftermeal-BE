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
import { EActivityScheduleType } from '../types/activity-schedule-type';
import { Participation } from '../../../participation/domain/participation.entity';
import { ActivityScheduleTypeTransformer } from '../types/activity-schedule-type.transformer';
import { LocalDate } from '@js-joda/core';
import { LocalDateTransformer } from '@common/transformers/local-date.transformer';

@Entity()
export class ActivitySchedule extends BaseTimeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: EActivityScheduleType.values(),
    transformer: new ActivityScheduleTypeTransformer(),
  })
  type: EActivityScheduleType;

  @Column({
    type: 'date',
    transformer: new LocalDateTransformer(),
  })
  scheduledDate: LocalDate;

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
    type: EActivityScheduleType,
    scheduledDate: LocalDate,
    activity: Activity,
  ): ActivitySchedule {
    const activitySchedule = new ActivitySchedule();
    activitySchedule.type = type;
    activitySchedule.scheduledDate = scheduledDate;
    activitySchedule.activity = activity;
    return activitySchedule;
  }
}
