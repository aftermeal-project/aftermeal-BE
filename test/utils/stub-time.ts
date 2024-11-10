import { TimeServices } from '@common/time/time.services';
import { LocalDate, LocalTime, ZonedDateTime, ZoneOffset } from '@js-joda/core';

export class StubTime implements TimeServices {
  private readonly currentTime: ZonedDateTime;

  constructor(currentTime: ZonedDateTime) {
    this.currentTime = currentTime;
  }

  static of(
    year: number,
    month: number,
    day: number,
    hour: number,
    minute: number,
    second: number,
  ): ZonedDateTime {
    return ZonedDateTime.of(
      LocalDate.of(year, month, day),
      LocalTime.of(hour, minute, second),
      ZoneOffset.UTC,
    );
  }

  now(): ZonedDateTime {
    return this.currentTime;
  }
}
