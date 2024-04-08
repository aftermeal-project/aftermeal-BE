import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsPositive,
  IsString,
  IsStrongPassword,
  Length,
} from 'class-validator';
import { IsSchoolEmail } from '@common/decorators/validation/is-school-email.decorator';
import { School } from '../domain/school';
import { MemberType } from '../domain/member-type';

export class UserRegisterRequestDto {
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

  @IsStrongPassword({}, { always: true })
  @Length(8, 20, { always: true })
  @IsString({ always: true })
  @IsNotEmpty({ always: true })
  password: string;
}
