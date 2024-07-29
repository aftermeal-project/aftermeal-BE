import {
  IsEmail,
  IsEnum,
  IsPositive,
  IsOptional,
  IsNotEmpty,
} from 'class-validator';
import { UserType } from '../../domain/user-type';

export class UserRegisterReqDto {
  @IsEmail({}, { message: '이메일은 이메일 형식이어야 합니다.' })
  email: string;

  @IsNotEmpty({ message: '이름은 필수값입니다.' })
  name: string;

  @IsEnum(UserType, {
    message: `사용자 유형은 다음 값 중 하나여야 합니다: ${Object.values(UserType)}`,
  })
  type: UserType;

  @IsPositive({ message: '기수 번호는 양수여야 합니다.' })
  @IsOptional()
  generationNumber?: number;

  @IsNotEmpty({ message: '비밀번호는 필수값입니다.' })
  password: string;
}
