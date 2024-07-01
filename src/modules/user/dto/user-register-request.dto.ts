import {
  Allow,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsPositive,
  IsStrongPassword,
  MaxLength,
} from 'class-validator';
import { IsSchoolEmail } from '@common/decorators/validation/is-school-email.decorator';
import { ESchool } from '../domain/school';
import { EUserType } from '../domain/user-type';

export class UserRegisterRequestDto {
  @IsSchoolEmail(ESchool.GSM, { groups: [EUserType.STUDENT.enumName] })
  @IsEmail({}, { always: true })
  email: string;

  @MaxLength(40, { always: true })
  @IsNotEmpty({ always: true })
  name: string;

  @IsEnum(EUserType.mappingEnum(), { always: true })
  // @Transform((params) => EUserType.find(params.value))
  memberType: EUserType;

  @IsPositive({ groups: [EUserType.STUDENT.enumName] })
  @Allow()
  generationNumber?: number;

  @IsStrongPassword({}, { always: true })
  @MaxLength(20, { always: true })
  password: string;
}
