import { Injectable, ValidationPipe } from '@nestjs/common';
import { validate, ValidationError, ValidatorOptions } from 'class-validator';
import { MemberType } from '../../modules/user/domain/member-type';

@Injectable()
export class ValidationByMemberTypePipe extends ValidationPipe {
  override async validate(value: any): Promise<ValidationError[]> {
    const validationOptions: ValidatorOptions = {};

    // Determine the validation group based on memberType
    if (value.memberType === MemberType.Student) {
      validationOptions.groups = [MemberType.Student];
    }

    const errors: ValidationError[] = await validate(value, {
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      strictGroups: true,
      ...validationOptions,
    });

    if (errors.length > 0) {
      throw await this.exceptionFactory(errors);
    }
    return value;
  }
}
