import { Time } from '@common/time/time';
import { ZonedDateTime, ZoneOffset } from '@js-joda/core';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JodaTime implements Time {
  now(): ZonedDateTime {
    return ZonedDateTime.now(ZoneOffset.UTC);
  }
}
