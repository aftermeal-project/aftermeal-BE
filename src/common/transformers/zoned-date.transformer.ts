import { ValueTransformer } from 'typeorm';
import { convert, ZonedDateTime } from '@js-joda/core';
import { Logger } from '@nestjs/common';

export class ZonedDateTimeTransformer implements ValueTransformer {
  private readonly logger = new Logger(ZonedDateTimeTransformer.name);

  to(entityValue: ZonedDateTime | null): Date | null {
    if (!entityValue) {
      return null;
    }

    try {
      return convert(entityValue).toDate();
    } catch (error) {
      this.logger.error('ZonedDateTime 변환 오류:', error);
      return null;
    }
  }

  from(databaseValue: string | null): ZonedDateTime | null {
    if (!databaseValue) {
      return null;
    }

    try {
      const isoString: string = new Date(databaseValue).toISOString();
      return ZonedDateTime.parse(isoString);
    } catch (error) {
      this.logger.error('ZonedDateTime 변환 오류:', error);
      return null;
    }
  }
}
