import {
  ArrayUnique,
  IsArray,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPositive,
} from 'class-validator';
import { MemberType } from '../../user/domain/vo/member-type';
import { IsSchoolEmail } from '@common/decorator/validation/is-school-email';
import { School } from '../../user/domain/vo/school';
import { IsGraduatedGeneration } from '@common/decorator/validation/is-graduated-generation';
import { IsExistGeneration } from '@common/decorator/validation/is-exist-generation';

export class InvitationForm {
  @IsSchoolEmail(School.GSM.code, { each: true, groups: [MemberType.STUDENT] })
  @ArrayUnique({ always: true })
  @IsEmail({}, { each: true, always: true })
  @IsArray({ always: true })
  @IsNotEmpty({ always: true })
  email: string[];

  @IsEnum(MemberType, { always: true })
  @IsNotEmpty({ always: true })
  memberType: MemberType;

  @IsGraduatedGeneration({ groups: [MemberType.STUDENT] })
  @IsExistGeneration({ groups: [MemberType.STUDENT] })
  @IsPositive({ groups: [MemberType.STUDENT] })
  @IsNumber({}, { groups: [MemberType.STUDENT] })
  @IsNotEmpty({ groups: [MemberType.STUDENT] })
  generationNumber?: number;
}
