import { ValueTransformer } from 'typeorm';
import { convert, LocalDate } from '@js-joda/core';
import { Logger } from '@nestjs/common';

export class LocalDateTransformer implements ValueTransformer {
  private readonly logger = new Logger(LocalDateTransformer.name);

  to(entityValue: LocalDate | null): Date | null {
    if (!entityValue) {
      return null;
    }

    try {
      return convert(entityValue).toDate();
    } catch (error) {
      this.logger.error('LocalDate 변환 오류:', error);
      return null;
    }
  }

  from(databaseValue: string | null): LocalDate | null {
    if (!databaseValue) {
      return null;
    }

    try {
      return LocalDate.parse(databaseValue);
    } catch (error) {
      this.logger.error('LocalDate 파싱 오류:', error);
      return null;
    }
  }
}
