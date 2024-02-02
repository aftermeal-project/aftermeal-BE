import {
  ArrayUnique,
  IsArray,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsPositive,
} from 'class-validator';
import { MemberType } from '../../user/domain/member-type';
import { IsSchoolEmail } from '@common/decorator/validation/is-school-email.decorator';
import { School } from '../../user/domain/school';

export class InviteRequestDto {
  @IsSchoolEmail(School.GSM, { each: true, groups: [MemberType.Student] })
  @ArrayUnique({ always: true })
  @IsEmail({}, { each: true, always: true })
  @IsArray({ always: true })
  @IsNotEmpty({ always: true })
  inviteeEmail: string[];

  @IsEnum(MemberType, { always: true })
  @IsNotEmpty({ always: true })
  inviteeMemberType: MemberType;

  @IsPositive({ groups: [MemberType.Student] })
  @IsNotEmpty({ groups: [MemberType.Student] })
  inviteeGenerationNumber?: number;
}
