import { matches, registerDecorator, ValidationOptions } from 'class-validator';
import { School } from '../../../modules/user/domain/vo/school';

/**
 * @param schoolCode
 * @param validationOptions
 * @description 학교 이메일인지 검증하는 데코레이터입니다.
 */
export function IsSchoolEmail(
  schoolCode: string,
  validationOptions?: ValidationOptions,
): (object: any, propertyName: string) => void {
  return function (target: () => void, propertyName: string) {
    registerDecorator({
      name: 'isSchoolEmail',
      target: target.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        defaultMessage(): string {
          return `email must be an ${schoolCode} email`;
        },
        validate(value: any): boolean {
          const school: School = School.findByCode(schoolCode);
          return typeof value === 'string' && matches(value, school.regExp);
        },
      },
    });
  };
}
