export interface TokenRepository {
  findUserIdByRefreshToken(refreshToken: string): Promise<number>;
  findEmailByEmailVerificationCode(
    emailVerificationCode: string,
  ): Promise<string>;
  saveRefreshToken(
    refreshToken: string,
    userId: number,
    ttl: number,
  ): Promise<void>;
  saveEmailVerificationCode(
    emailVerificationCode: string,
    email: string,
    ttl: number,
  ): Promise<void>;
  deleteRefreshToken(refreshToken: string): Promise<void>;
  deleteEmailVerificationCode(emailVerificationCode: string): Promise<void>;
  deleteAll(): Promise<void>;
}
