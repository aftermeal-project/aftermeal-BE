import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsPositive,
  IsString,
} from 'class-validator';
import { IsSchoolEmail } from '@common/decorator/validation/is-school-email';
import { School } from '../domain/school';
import { MemberType } from '../domain/member-type';

export class SignUpForm {
  @IsSchoolEmail(School.GSM, { groups: [MemberType.Student] })
  @IsEmail({}, { always: true })
  @IsString({ always: true })
  @IsNotEmpty({ always: true })
  email: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(MemberType, { always: true })
  @IsNotEmpty({ always: true })
  memberType: MemberType;

  @IsPositive({ groups: [MemberType.Student] })
  @IsNotEmpty({ groups: [MemberType.Student] })
  generationNumber?: number;
}
