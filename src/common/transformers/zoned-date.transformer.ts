import { ValueTransformer } from 'typeorm';
import { convert, nativeJs, ZonedDateTime, ZoneOffset } from '@js-joda/core';

export class ZonedDateTimeTransformer implements ValueTransformer {
  to(entityValue: ZonedDateTime | null): Date | null {
    if (!entityValue) {
      return null;
    }

    return convert(entityValue).toDate();
  }

  from(databaseValue: string | null): ZonedDateTime | null {
    if (!databaseValue) {
      return null;
    }

    return nativeJs(new Date(databaseValue), ZoneOffset.UTC);
  }
}
