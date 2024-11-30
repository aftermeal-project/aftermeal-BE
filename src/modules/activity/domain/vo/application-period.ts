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
    startAt: ZonedDateTime,
    endAt: ZonedDateTime,
  ): ApplicationPeriod {
    if (startAt.isAfter(endAt)) {
      throw new Error(
        `유효하지 않은 신청 기간: 시작 시간(${startAt})은 마감 시간(${endAt})보다 이전이어야 합니다.`,
      );
    }

    const applicationPeriod: ApplicationPeriod = new ApplicationPeriod();
    applicationPeriod._startAt = startAt;
    applicationPeriod._endAt = endAt;

    return applicationPeriod;
  }

  isWithinApplicationPeriod(dateTime: ZonedDateTime): boolean {
    const inclusiveStart: boolean =
      dateTime.isAfter(this.startAt) || dateTime.isEqual(this.startAt);
    const inclusiveEnd: boolean =
      dateTime.isBefore(this.endAt) || dateTime.isEqual(this.endAt);

    return inclusiveStart && inclusiveEnd;
  }
}
