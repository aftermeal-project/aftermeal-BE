import { registerDecorator, ValidationOptions } from 'class-validator';
import { LocalDate } from '@js-joda/core';

export function IsLocalDate(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'IsLocalDate',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          return value instanceof LocalDate;
        },
        defaultMessage() {
          return '날짜 형식이어야 합니다.';
        },
      },
    });
  };
}
