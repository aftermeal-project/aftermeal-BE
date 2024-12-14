import { IsNotEmpty, IsString } from 'class-validator';

export class EmailVerificationRequestDto {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  code: string;
}
