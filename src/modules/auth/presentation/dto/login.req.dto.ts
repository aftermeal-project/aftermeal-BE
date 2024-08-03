import { IsString } from 'class-validator';

export class LoginRequestDTO {
  @IsString({ message: '이메일은 문자열 형식이어야 합니다.' })
  email: string;

  @IsString({ message: '비밀번호는 문자열 형식이어야 합니다.' })
  password: string;
}
