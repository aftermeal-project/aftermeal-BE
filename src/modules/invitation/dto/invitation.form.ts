import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateIf,
} from 'class-validator';
import { IsSchoolEmail } from '@common/decorator/validation/is-school-email';
import { MemberType } from '../../user/domain/vo/member-type';
import { School } from '../../user/domain/vo/school';

export class InvitationForm {
  @IsSchoolEmail(School.GSM.code, { each: true, groups: [MemberType.Student] })
  @IsArray({ always: true })
  @IsNotEmpty({ always: true })
  email: string[];

  @IsEnum(MemberType, { always: true })
  @IsString({ always: true })
  @IsNotEmpty({ always: true })
  type: string;

  @Min(1)
  @IsNumber()
  @IsOptional({ groups: [MemberType.Teacher] })
  // type이 'STUDENT'가 아니면 해당 필드에 해당하는 모든 유효성 검사 규칙을 무시한다.
  @ValidateIf((object) => object.type === MemberType.Student)
  generationNumber?: number | null;
}
