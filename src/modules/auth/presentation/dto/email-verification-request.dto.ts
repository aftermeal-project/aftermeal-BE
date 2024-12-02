import { IsString } from 'class-validator';

export class EmailVerificationRequestDto {
  @IsString()
  code: string;
}
