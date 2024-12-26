import { ValueTransformer } from 'typeorm';
import { LocalDate } from '@js-joda/core';

export class LocalDateTransformer implements ValueTransformer {
  to(entityValue: LocalDate | null): string | null {
    if (!entityValue) {
      return null;
    }

    return entityValue.toString();
  }

  from(databaseValue: string | null): LocalDate | null {
    if (!databaseValue) {
      return null;
    }

    return LocalDate.parse(databaseValue);
  }
}
