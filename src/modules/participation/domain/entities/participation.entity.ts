import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BaseTimeEntity } from '@common/models/base-time.entity';
import { User } from '../../../user/domain/entities/user.entity';
import { Activity } from '../../../activity/domain/entities/activity.entity';
import { AlreadyExistException } from '@common/exceptions/already-exist.exception';
import { IllegalStateException } from '@common/exceptions/illegal-state.exception';
import { ZonedDateTime } from '@js-joda/core';

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

  static create(
    activity: Activity,
    user: User,
    currentDateTime: ZonedDateTime,
  ): Participation {
    if (activity.participations.some((p) => p.isOwnedBy(user))) {
      throw new AlreadyExistException('이미 참가한 활동입니다.');
    }

    if (activity.isFull()) {
      throw new IllegalStateException('이미 참가 인원이 꽉 찼습니다.');
    }

    if (!activity.isWithInPeriod(currentDateTime)) {
      throw new IllegalStateException('참가 신청 기간이 아닙니다.');
    }

    const participation: Participation = new Participation();
    participation.activity = activity;
    participation.user = user;

    return participation;
  }

  isOwnedBy(user: User): boolean {
    return this.user.id === user.id;
  }
}
