import { TimeServices } from '@common/time/time.services';
import { ZonedDateTime, ZoneOffset } from '@js-joda/core';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JodaTimeService implements TimeServices {
  now(): ZonedDateTime {
    return ZonedDateTime.now(ZoneOffset.UTC);
  }
}
