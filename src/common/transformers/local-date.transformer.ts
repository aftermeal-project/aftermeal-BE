import { ValueTransformer } from 'typeorm';
import { convert, LocalDate, nativeJs } from '@js-joda/core';

export class LocalDateTransformer implements ValueTransformer {
  to(entityValue: LocalDate): Date {
    return convert(entityValue).toDate();
  }

  from(databaseValue: Date | string): LocalDate {
    if (typeof databaseValue === 'string') {
      return LocalDate.parse(databaseValue);
    }
    return nativeJs(databaseValue).toLocalDate();
  }
}
