import {
  ArrayUnique,
  IsArray,
  IsEmail,
  IsEnum,
  IsNotEmpty,
} from 'class-validator';
import { EUserType } from '../../user/domain/user-type';

export class InviteRequestDto {
  // @IsSchoolEmail(School.GSM, { each: true, groups: [MemberType.STUDENT] })
  @ArrayUnique({ always: true })
  @IsEmail({}, { each: true, always: true })
  @IsArray({ always: true })
  @IsNotEmpty({ always: true })
  inviteeEmail: string[];

  @IsEnum(EUserType, { always: true })
  @IsNotEmpty({ always: true })
  inviteeMemberType: EUserType;

  // @IsPositive({ groups: [MemberType.STUDENT] })
  // @IsNotEmpty({ groups: [MemberType.STUDENT] })
  inviteeGenerationNumber?: number;
}
