import { ZonedDateTime } from '@js-joda/core';

export interface Time {
  now(): ZonedDateTime;
}
