import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export function IsEnumClass<T>(
  enumClass: T,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'IsEnumClass',
      target: object.constructor,
      propertyName,
      constraints: [enumClass],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [enumClass] = args.constraints;
          const enumValues: ReadonlyArray<T> = enumClass.values();

          return enumValues.includes(value);
        },
        defaultMessage(args: ValidationArguments) {
          const [enumClass] = args.constraints;
          const enumValues = enumClass.values().map((item) => item.code);

          return `$property은(는) 다음 값 중 하나여야 합니다: ${enumValues.join(', ')}`;
        },
      },
    });
  };
}
