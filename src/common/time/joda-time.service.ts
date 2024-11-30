import { TimeService } from '@common/time/time.service';
import { ZonedDateTime, ZoneOffset } from '@js-joda/core';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JodaTimeService implements TimeService {
  now(): ZonedDateTime {
    return ZonedDateTime.now(ZoneOffset.UTC);
  }
}
