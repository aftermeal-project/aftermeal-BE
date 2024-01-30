import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsPositive,
  IsString,
  Length,
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

  @Length(2, 10, { always: true })
  @IsString({ always: true })
  @IsNotEmpty({ always: true })
  name: string;

  @IsEnum(MemberType, { always: true })
  @IsNotEmpty({ always: true })
  memberType: MemberType;

  @IsPositive({ groups: [MemberType.Student] })
  @IsNotEmpty({ groups: [MemberType.Student] })
  generationNumber?: number;
}
