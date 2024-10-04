import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { LocalDate } from '@js-joda/core';

@ValidatorConstraint({ name: 'LocalDateValidator', async: false })
export class LocalDateValidator implements ValidatorConstraintInterface {
  validate(value: any) {
    return value instanceof LocalDate;
  }

  defaultMessage() {
    return '날짜 형식이어야 합니다.';
  }
}
