import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';
import { validate, ValidationError, ValidatorOptions } from 'class-validator';
<<<<<<< Updated upstream
import { MemberType } from '../../modules/user/domain/vo/member-type';
import { InvitationForm } from '../../modules/invitation/dto/invitation.form';

@Injectable()
export class MemberTypeValidationPipe
  implements PipeTransform<InvitationForm, Promise<InvitationForm>>
{
  async transform(value: InvitationForm): Promise<InvitationForm> {
=======
import { MemberType } from '../../modules/user/domain/member-type';
import { SignUpRequestDto } from '../../modules/user/dto/sign-up.request-dto';

@Injectable()
export class MemberTypeValidationPipe
  implements PipeTransform<SignUpRequestDto, Promise<SignUpRequestDto>>
{
  async transform(value: SignUpRequestDto): Promise<SignUpRequestDto> {
>>>>>>> Stashed changes
    const validationOptions: ValidatorOptions = {};

    // Determine the validation group based on memberType
    if (value.memberType === MemberType.Student) {
      validationOptions.groups = [MemberType.Student];
    }

    const errors: ValidationError[] = await validate(value, {
      stopAtFirstError: true,
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