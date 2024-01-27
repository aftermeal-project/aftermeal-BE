import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';
import { validate, ValidationError, ValidatorOptions } from 'class-validator';
import { MemberType } from '../../modules/user/domain/member-type';
import { InviteRequestDto } from '../../modules/invitation/dto/invite.request-dto';

@Injectable()
export class MemberTypeValidationPipe
  implements PipeTransform<InviteRequestDto, Promise<InviteRequestDto>>
{
  async transform(value: InviteRequestDto): Promise<InviteRequestDto> {
    const validationOptions: ValidatorOptions = {};

    // Determine the validation group based on memberType
    if (value.inviteeMemberType === MemberType.Student) {
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
