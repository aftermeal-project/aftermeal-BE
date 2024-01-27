import { IsNotEmpty, IsString } from 'class-validator';

export class SignUpForm {
  @IsString()
  @IsNotEmpty()
  name: string;
}
