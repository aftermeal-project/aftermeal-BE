import { IsString } from 'class-validator';

export class LogoutRequestDto {
  @IsString()
  refreshToken: string;
}
