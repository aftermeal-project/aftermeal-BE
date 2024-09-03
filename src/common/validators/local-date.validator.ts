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
    return 'must be a valid LocalDate';
  }
}
