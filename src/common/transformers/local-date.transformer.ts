import { ValueTransformer } from 'typeorm';
import { convert, LocalDate, nativeJs } from '@js-joda/core';

export class LocalDateTransformer implements ValueTransformer {
  to(entityValue: LocalDate | string | null): Date | null {
    if (!entityValue) {
      return null;
    }

    if (typeof entityValue === 'string') {
      return new Date(entityValue);
    }

    return convert(entityValue).toDate();
  }

  from(databaseValue: string | null): LocalDate | null {
    if (!databaseValue) {
      return null;
    }

    return nativeJs(new Date(databaseValue)).toLocalDate();
  }
}
