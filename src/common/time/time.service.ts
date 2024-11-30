import { ZonedDateTime } from '@js-joda/core';

export interface TimeService {
  now(): ZonedDateTime;
}
