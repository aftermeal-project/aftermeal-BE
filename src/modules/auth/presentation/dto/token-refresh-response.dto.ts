import { Exclude, Expose } from 'class-transformer';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';

export class TokenRefreshResponseDto {
  @Exclude() @ApiHideProperty() private readonly _accessToken: string;
  @Exclude() @ApiHideProperty() private readonly _tokenType: string;
  @Exclude() @ApiHideProperty() private readonly _expiredIn: number;
  @Exclude() @ApiHideProperty() private readonly _refreshToken: string;

  constructor(
    accessToken: string,
    tokenType: string,
    expiredIn: number,
    refreshToken: string,
  ) {
    this._accessToken = accessToken;
    this._tokenType = tokenType;
    this._expiredIn = expiredIn;
    this._refreshToken = refreshToken;
  }

  @Expose()
  @ApiProperty()
  get accessToken(): string {
    return this._accessToken;
  }

  @Expose()
  @ApiProperty()
  get tokenType(): string {
    return this._tokenType;
  }

  @Expose()
  @ApiProperty()
  get expiredIn(): number {
    return this._expiredIn;
  }

  @Expose()
  @ApiProperty()
  get refreshToken(): string {
    return this._refreshToken;
  }
}
