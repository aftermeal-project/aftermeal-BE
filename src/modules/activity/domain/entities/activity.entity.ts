import { BaseTimeEntity } from '@common/models/base-time.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EActivityType } from './activity-type';
import { Participation } from '../../../participation/domain/entities/participation.entity';
import { ActivityTypeTransformer } from '../../infrastructure/transformers/activity-type.transformer';
import { LocalDate, ZonedDateTime } from '@js-joda/core';
import { LocalDateTransformer } from '@common/transformers/local-date.transformer';
import { ActivityLocation } from '../../../activity-location/domain/entities/activity-location.entity';
import { ZonedDateTimeTransformer } from '@common/transformers/zoned-date.transformer';
import { ApplicationPeriod } from '../vo/application-period';
import { IllegalStateException } from '@common/exceptions/illegal-state.exception';
import { IllegalArgumentException } from '@common/exceptions/illegal-argument.exception';

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
    type: 'datetime',
    transformer: new ZonedDateTimeTransformer(),
  })
  startAt: ZonedDateTime;

  @Column({
    type: 'datetime',
    transformer: new ZonedDateTimeTransformer(),
  })
  endAt: ZonedDateTime;

  @Column(() => ApplicationPeriod)
  applicationPeriod: ApplicationPeriod;

  @ManyToOne(() => ActivityLocation, {
    nullable: false,
    eager: true,
    cascade: true,
  })
  @JoinColumn({
    name: 'activity_location_id',
    foreignKeyConstraintName: 'fk_activity_activity_location',
  })
  location: ActivityLocation;

  @OneToMany(() => Participation, (participation) => participation.activity, {
    nullable: false,
    eager: true,
    cascade: true,
  })
  participations: Participation[];

  static create(
    title: string,
    maxParticipants: number,
    activityLocation: ActivityLocation,
    type: EActivityType,
    scheduledDate: LocalDate,
    currentDateTime: ZonedDateTime,
  ): Activity {
    if (scheduledDate.isBefore(currentDateTime.toLocalDate())) {
      throw new IllegalArgumentException(
        '활동 예정 날짜는 과거로 설정할 수 없습니다.',
      );
    }

    const startAt: ZonedDateTime = type.getActivityStartDateTime(scheduledDate);
    const endAt: ZonedDateTime = type.getActivityEndDateTime(scheduledDate);

    if (currentDateTime.isAfter(startAt)) {
      throw new IllegalStateException(
        '활동 시작 시간 이후엔 활동을 생성할 수 없습니다.',
      );
    }

    const applicationPeriod: ApplicationPeriod = ApplicationPeriod.create(
      startAt,
      currentDateTime,
    );

    const activity: Activity = new Activity();
    activity.title = title;
    activity.maxParticipants = maxParticipants;
    activity.location = activityLocation;
    activity.type = type;
    activity.scheduledDate = scheduledDate;
    activity.startAt = startAt;
    activity.endAt = endAt;
    activity.applicationPeriod = applicationPeriod;
    activity.participations = [];

    return activity;
  }

  update(
    title: string,
    maxParticipants: number,
    location: ActivityLocation,
    type: EActivityType,
    scheduledDate: LocalDate,
  ): void {
    this.title = title;
    this.maxParticipants = maxParticipants;
    this.location = location;
    this.type = type;
    this.scheduledDate = scheduledDate;
  }

  isFull(): boolean {
    return this.participations.length >= this.maxParticipants;
  }

  isWithinApplicationPeriod(currentTime: ZonedDateTime): boolean {
    return (
      this.applicationPeriod.startAt.isBefore(currentTime) &&
      this.applicationPeriod.endAt.isAfter(currentTime)
    );
  }
}
