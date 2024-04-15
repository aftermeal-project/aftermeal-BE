import { IsNotEmpty } from 'class-validator';

export class LoginRequestDto {
  @IsNotEmpty({ always: true })
  email: string;

  @IsNotEmpty({ always: true })
  password: string;
}
