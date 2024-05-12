import { ArgumentMetadata, Injectable, ValidationPipe } from '@nestjs/common';
import { validate, ValidationError } from 'class-validator';
import { EUserType } from '../../modules/user/domain/user-type';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ValidationByMemberTypePipe extends ValidationPipe {
  async transform(
    value: any,
    { metatype }: ArgumentMetadata,
  ): Promise<ValidationError[]> {
    // Determine the validation group based on memberType
    if (value.memberType === EUserType.STUDENT.name) {
      const object = plainToInstance(metatype, value);
      const errors: ValidationError[] = await validate(object, {
        strictGroups: true,
        groups: [EUserType.STUDENT.enumName],
      });

      if (errors.length > 0) {
        throw await this.exceptionFactory(errors);
      }
    }
    return value;
  }
}
