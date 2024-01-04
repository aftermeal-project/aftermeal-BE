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
  @IsSchoolEmail(School.GSM.code, { each: true, groups: [MemberType.Student] })
  @ArrayUnique({ always: true })
  @IsEmail({}, { each: true, always: true })
  @IsArray({ always: true })
  @IsNotEmpty({ always: true })
  email: string[];

  @IsEnum(MemberType, { always: true })
  @IsNotEmpty({ always: true })
  memberType: MemberType;

  @IsGraduatedGeneration({ groups: [MemberType.Student] })
  @IsExistGeneration({ groups: [MemberType.Student] })
  @IsPositive({ groups: [MemberType.Student] })
  @IsNumber({}, { groups: [MemberType.Student] })
  @IsNotEmpty({ groups: [MemberType.Student] })
  generationNumber?: number;
}
