import { Exclude, Expose } from 'class-transformer';

export class LoginResponseDto {
  @Exclude() private readonly _accessToken: string;
  @Exclude() private readonly _tokenType: string;
  @Exclude() private readonly _expiredIn: number;
  @Exclude() private readonly _refreshToken?: string;

  constructor(
    accessToken: string,
    tokenType: string,
    expiredIn: number,
    refreshToken?: string,
  ) {
    this._accessToken = accessToken;
    this._tokenType = tokenType;
    this._expiredIn = expiredIn;
    this._refreshToken = refreshToken;
  }

  @Expose()
  get accessToken(): string {
    return this._accessToken;
  }

  @Expose()
  get tokenType(): string {
    return this._tokenType;
  }

  @Expose()
  get expiredIn(): number {
    return this._expiredIn;
  }

  @Expose()
  get refreshToken(): string {
    return this?._refreshToken;
  }
}
