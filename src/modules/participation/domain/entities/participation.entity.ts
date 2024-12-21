import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BaseTimeEntity } from '@common/models/base-time.entity';
import { User } from '../../../user/domain/entities/user.entity';
import { Activity } from '../../../activity/domain/entities/activity.entity';
import { ZonedDateTime } from '@js-joda/core';
import { ExceedMaxParticipantException } from '@common/exceptions/exceed-max-participant.exception';
import { AlreadyParticipateActivityException } from '@common/exceptions/already-participate-activity.exception';
import { NotAvailableParticipateException } from '@common/exceptions/not-available-participate.exception';

@Entity()
export class Participation extends BaseTimeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { eager: true, nullable: false })
  @JoinColumn({
    name: 'user_id',
    foreignKeyConstraintName: 'fk_participation_user',
  })
  user: User;

  @ManyToOne(() => Activity, (activity) => activity.participations, {
    eager: false,
    nullable: false,
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
    if (activity.hasParticipation(user)) {
      throw new AlreadyParticipateActivityException();
    }

    if (activity.isFull()) {
      throw new ExceedMaxParticipantException();
    }

    if (!activity.isApplicationOpen(currentDateTime)) {
      throw new NotAvailableParticipateException();
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
