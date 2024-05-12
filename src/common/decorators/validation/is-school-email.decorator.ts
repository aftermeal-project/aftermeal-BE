import {
  buildMessage,
  matches,
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';
import { ESchool } from '../../../modules/user/domain/school';

/**
 * @param school
 * @param validationOptions
 * @description 학교 이메일인지 검증하는 데코레이터입니다.
 */
export function IsSchoolEmail(
  school: ESchool,
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return function (target: object, propertyKey: string) {
    registerDecorator({
      name: 'isSchoolEmail',
      target: target.constructor,
      propertyName: propertyKey,
      constraints: [school],
      options: validationOptions,
      validator: {
        validate(
          value: unknown,
          validationArguments: ValidationArguments,
        ): Promise<boolean> | boolean {
          const { emailFormat }: ESchool = validationArguments?.constraints[0];
          return typeof value === 'string' && matches(value, emailFormat);
        },
        defaultMessage: buildMessage(
          (eachPrefix) =>
            eachPrefix + '$property should follow $constraint1 format',
          validationOptions,
        ),
      },
    });
  };
}
