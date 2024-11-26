import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { UserType } from '../../domain/types/user-type';

export class UserRegistrationRequestDto {
  @IsNotEmpty({ message: '이름은 빈 값일 수 없습니다.' })
  @IsString({ message: '이름은 문자열이어야 합니다.' })
  name: string;

  @IsEmail({}, { message: '이메일은 이메일 형식이어야 합니다.' })
  email: string;

  @IsEnum(UserType, {
    message: `사용자 유형은 다음 값 중 하나여야 합니다: ${Object.values(UserType)}`,
  })
  type: UserType;

  @IsPositive({ message: '기수 번호는 양수여야 합니다.' })
  @IsOptional()
  generationNumber?: number;

  @IsNotEmpty({ message: '비밀번호는 필수값입니다.' })
  @IsString({ message: '이름은 문자열이어야 합니다.' })
  password: string;
}
