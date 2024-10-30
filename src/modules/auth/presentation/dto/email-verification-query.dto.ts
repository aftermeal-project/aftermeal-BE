import { IsString } from 'class-validator';

export class EmailVerificationQueryDto {
  @IsString()
  token: string;
}
