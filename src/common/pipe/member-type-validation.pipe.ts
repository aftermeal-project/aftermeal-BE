import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';
import { validate, ValidationError, ValidatorOptions } from 'class-validator';
import { MemberType } from '../../modules/user/domain/member-type';
import { SignUpForm } from '../../modules/user/dto/sign-up.form';

@Injectable()
export class MemberTypeValidationPipe
  implements PipeTransform<SignUpForm, Promise<SignUpForm>>
{
  async transform(value: SignUpForm): Promise<SignUpForm> {
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
    // TODO: ErrorResponse 포맷 수정 필요 (현재는 class-validator의 ValidationError 포맷을 그대로 반환)

    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }
    return value;
  }
}
