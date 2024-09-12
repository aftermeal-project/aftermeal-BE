import {
  ArrayUnique,
  IsArray,
  IsEmail,
  IsEnum,
  IsNotEmpty,
} from 'class-validator';
import { UserType } from '../../../user/domain/types/user-type';

export class InviteRequestDto {
  // @IsSchoolEmail(School.GSM, { each: true, groups: [MemberType.STUDENT] })
  @ArrayUnique({ always: true })
  @IsEmail({}, { each: true, always: true })
  @IsArray({ always: true })
  @IsNotEmpty({ always: true })
  inviteeEmail: string[];

  @IsEnum(UserType, { always: true })
  @IsNotEmpty({ always: true })
  inviteeMemberType: UserType;

  // @IsPositive({ groups: [MemberType.STUDENT] })
  // @IsNotEmpty({ groups: [MemberType.STUDENT] })
  inviteeGenerationNumber?: number;

  toEntity() {
    return undefined;
  }
}
