import { ZonedDateTime } from '@js-joda/core';
import { Column } from 'typeorm';
import { ZonedDateTimeTransformer } from '@common/transformers/zoned-date.transformer';

export class ApplicationPeriod {
  @Column({
    name: 'application_start_at',
    type: 'datetime',
    transformer: new ZonedDateTimeTransformer(),
  })
  private readonly _startAt: ZonedDateTime;

  @Column({
    name: 'application_end_at',
    type: 'datetime',
    transformer: new ZonedDateTimeTransformer(),
  })
  private readonly _endAt: ZonedDateTime;

  get startAt(): ZonedDateTime {
    return this._startAt;
  }

  get endAt(): ZonedDateTime {
    return this._endAt;
  }

  constructor(activityStartAt: ZonedDateTime, currentDateTime: ZonedDateTime) {
    this._startAt = currentDateTime.isAfter(activityStartAt.minusHours(4))
      ? currentDateTime
      : activityStartAt.minusHours(4);
    this._endAt = activityStartAt.minusMinutes(30);
    this.validate();
  }

  private validate(): void {
    if (this._startAt.isAfter(this._endAt)) {
      throw new Error('신청 마감 시간은 신청 시작 시간보다 이후여야 합니다.');
    }
  }
}
