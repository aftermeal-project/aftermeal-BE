import { ZonedDateTime } from '@js-joda/core';

export interface TimeServices {
  now(): ZonedDateTime;
}
