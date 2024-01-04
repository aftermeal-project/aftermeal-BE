import {
  buildMessage,
  matches,
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';
import { School } from '../../../modules/user/domain/vo/school';

/**
 * @param schoolCode
 * @param validationOptions
 * @description 학교 이메일인지 검증하는 데코레이터입니다.
 */
export function IsSchoolEmail(
  schoolCode: string,
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return function (target: object, propertyKey: string) {
    registerDecorator({
      name: 'isSchoolEmail',
      target: target.constructor,
      propertyName: propertyKey,
      constraints: [schoolCode],
      options: validationOptions,
      validator: {
        validate(
          value: unknown,
          validationArguments: ValidationArguments,
        ): Promise<boolean> | boolean {
          console.log('이거 왜 실행되나요?');
          const { regExp }: School = School.findByCode(
            validationArguments?.constraints[0],
          );
          return typeof value === 'string' && matches(value, regExp);
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
