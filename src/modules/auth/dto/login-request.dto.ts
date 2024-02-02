import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginRequestDto {
  @IsEmail({}, { always: true })
  @IsString({ always: true })
  @IsNotEmpty({ always: true })
  email: string;

  @IsString({ always: true })
  @IsNotEmpty({ always: true })
  password: string;
}
