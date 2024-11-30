import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { ZonedDateTime } from '@js-joda/core';

@ValidatorConstraint({ name: 'ZonedDateTimeValidator', async: false })
export class ZonedDateTimeValidator implements ValidatorConstraintInterface {
  validate(value: any): boolean {
    return value instanceof ZonedDateTime;
  }

  defaultMessage(): string {
    return '날짜 형식이어야 합니다.';
  }
}
