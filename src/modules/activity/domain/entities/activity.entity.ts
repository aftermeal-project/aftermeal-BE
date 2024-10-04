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
import { LocalDate, ZonedDateTime, ZoneOffset } from '@js-joda/core';
import { LocalDateTransformer } from '@common/transformers/local-date.transformer';
import { ActivityLocation } from '../../../activity-location/domain/entities/activity-location.entity';
import { User } from '../../../user/domain/entities/user.entity';
import { IllegalStateException } from '@common/exceptions/illegal-state.exception';
import { AlreadyExistException } from '@common/exceptions/already-exist.exception';
import { IllegalArgumentException } from '@common/exceptions/illegal-argument.exception';
import { ZonedDateTimeTransformer } from '@common/transformers/zoned-date.transformer';

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

  @Column({
    type: 'datetime',
    transformer: new ZonedDateTimeTransformer(),
  })
  applicationStartAt: ZonedDateTime;

  @Column({
    type: 'datetime',
    transformer: new ZonedDateTimeTransformer(),
  })
  applicationEndAt: ZonedDateTime;

  @ManyToOne(() => ActivityLocation, { nullable: false, eager: true })
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
    const startAt: ZonedDateTime = scheduledDate
      .atTime(type.startAt)
      .atZone(ZoneOffset.UTC);
    const endAt: ZonedDateTime = scheduledDate
      .atTime(type.endAt)
      .atZone(ZoneOffset.UTC);

    this.validateStartAt(startAt, currentDateTime);

    const activity = new Activity();
    activity.title = title;
    activity.maxParticipants = maxParticipants;
    activity.location = activityLocation;
    activity.type = type;
    activity.scheduledDate = scheduledDate;
    activity.startAt = startAt;
    activity.endAt = endAt;
    activity.applicationStartAt = startAt.minusHours(4);
    activity.applicationEndAt = startAt.minusMinutes(30);

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

  addParticipant(user: User, currentDateTime: ZonedDateTime): void {
    this.canParticipate(user, currentDateTime);

    const participation = new Participation();
    participation.user = user;
    participation.activity = this;

    this.participations.push(participation);
  }

  private static validateStartAt(
    startAt: ZonedDateTime,
    currentDateTime: ZonedDateTime,
  ) {
    if (startAt.isBefore(currentDateTime)) {
      throw new IllegalStateException('과거 날짜로 예약할 수 없습니다.');
    }

    const deadline: ZonedDateTime = startAt.minusHours(4);
    if (currentDateTime.isAfter(deadline)) {
      throw new IllegalStateException(
        '당일 활동은 활동 시작 4시간 전까지만 생성할 수 있습니다.',
      );
    }
  }

  private canParticipate(user: User, currentDateTime: ZonedDateTime): void {
    if (!this.isWithInPeriod(currentDateTime)) {
      throw new IllegalStateException('참가 신청 기간이 아닙니다.');
    }

    if (this.participations.length >= this.maxParticipants) {
      throw new IllegalStateException('참가 인원이 초과되었습니다.');
    }

    if (this.participations.some((p) => p.isOwnedBy(user))) {
      throw new AlreadyExistException('이미 참가한 활동입니다.');
    }
  }

  private isWithInPeriod(currentTime: ZonedDateTime): boolean {
    return (
      this.applicationStartAt.isBefore(currentTime) &&
      this.applicationEndAt.isAfter(currentTime)
    );
  }
}
