import { Exclude, Expose } from 'class-transformer';
import { User } from '../../../user/domain/entities/user.entity';

export class LoginResponseDto {
  @Exclude() private readonly _accessToken: string;
  @Exclude() private readonly _tokenType: string;
  @Exclude() private readonly _expiredIn: number;
  @Exclude() private readonly _refreshToken: string;
  @Exclude() private readonly _user: User;

  constructor(
    accessToken: string,
    tokenType: string,
    expiredIn: number,
    refreshToken: string,
    user: User,
  ) {
    this._accessToken = accessToken;
    this._tokenType = tokenType;
    this._expiredIn = expiredIn;
    this._refreshToken = refreshToken;
    this._user = user;
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
    return this._refreshToken;
  }

  @Expose()
  get user(): { id: number; name: string; roles: string[] } {
    return {
      id: this._user.id,
      name: this._user.name,
      roles: this._user.roles.map((role) => role.role.name),
    };
  }
}
