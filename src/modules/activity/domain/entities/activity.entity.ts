import { BaseTimeEntity } from '@common/models/base-time.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EActivityType } from '../types/activity-type';
import { Participation } from '../../../participation/domain/entities/participation.entity';
import { ActivityTypeTransformer } from '../types/activity-type.transformer';
import { LocalDate } from '@js-joda/core';
import { LocalDateTransformer } from '@common/transformers/local-date.transformer';
import { ActivityStatus } from '../types/activity-status';
import { ActivityLocation } from '../../../activity-location/domain/entities/activity-location.entity';

@Entity()
export class Activity extends BaseTimeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  maxParticipants: number;

  @Column({
    type: 'enum',
    enum: EActivityType.values(),
    transformer: new ActivityTypeTransformer(),
  })
  type: EActivityType;

  @Column({
    type: 'date',
    transformer: new LocalDateTransformer(),
  })
  scheduledDate: LocalDate;

  @Column({
    type: 'enum',
    enum: ActivityStatus,
    default: ActivityStatus.SCHEDULED,
  })
  status: ActivityStatus;

  @ManyToOne(() => ActivityLocation, { nullable: false, eager: true })
  @JoinColumn({
    name: 'activity_location_id',
    foreignKeyConstraintName: 'fk_activity_activity_location',
  })
  location: ActivityLocation;

  @OneToMany(() => Participation, (participation) => participation.activity)
  participations: Participation[];

  static create(
    title: string,
    maxParticipants: number,
    activityLocation: ActivityLocation,
    type: EActivityType,
    scheduledDate: LocalDate,
  ): Activity {
    const activity = new Activity();
    activity.title = title;
    activity.maxParticipants = maxParticipants;
    activity.location = activityLocation;
    activity.type = type;
    activity.scheduledDate = scheduledDate;
    return activity;
  }

  update(
    title: string,
    maxParticipation: number,
    activityLocation: ActivityLocation,
    type: EActivityType,
    scheduledDate: LocalDate,
  ) {
    this.title = title;
    this.maxParticipants = maxParticipation;
    this.location = activityLocation;
    this.type = type;
    this.scheduledDate = scheduledDate;
  }
}
