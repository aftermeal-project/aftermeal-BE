import { ZonedDateTime } from '@js-joda/core';
import { Column } from 'typeorm';
import { ZonedDateTimeTransformer } from '@common/transformers/zoned-date.transformer';

export class ApplicationPeriod {
  @Column({
    name: 'application_start_at',
    type: 'datetime',
    transformer: new ZonedDateTimeTransformer(),
  })
  private _startAt: ZonedDateTime;

  @Column({
    name: 'application_end_at',
    type: 'datetime',
    transformer: new ZonedDateTimeTransformer(),
  })
  private _endAt: ZonedDateTime;

  get startAt(): ZonedDateTime {
    return this._startAt;
  }

  get endAt(): ZonedDateTime {
    return this._endAt;
  }

  static create(
    activityStartAt: ZonedDateTime,
    currentDateTime: ZonedDateTime,
  ): ApplicationPeriod {
    const applicationPeriod: ApplicationPeriod = new ApplicationPeriod();
    applicationPeriod._startAt = currentDateTime.isAfter(
      activityStartAt.minusHours(4),
    )
      ? currentDateTime
      : activityStartAt.minusHours(4);
    applicationPeriod._endAt = activityStartAt.minusMinutes(30);
    if (applicationPeriod._startAt.isAfter(applicationPeriod._endAt)) {
      throw new Error('신청 마감 시간은 신청 시작 시간보다 이후여야 합니다.');
    }

    return applicationPeriod;
  }
}
