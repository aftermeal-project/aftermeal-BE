import { IsString } from 'class-validator';

export class TokenRefreshRequestDto {
  @IsString()
  refreshToken: string;
}
