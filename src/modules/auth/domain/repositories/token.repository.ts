export interface TokenRepository {
  findUserIdByRefreshToken(refreshToken: string): Promise<number>;
  findEmailByEmailVerificationToken(
    emailVerificationToken: string,
  ): Promise<string>;
  saveRefreshToken(
    refreshToken: string,
    userId: number,
    ttl: number,
  ): Promise<void>;
  saveEmailVerificationToken(
    emailVerificationToken: string,
    email: string,
    ttl: number,
  ): Promise<void>;
  deleteRefreshToken(refreshToken: string): Promise<void>;
  deleteEmailVerificationToken(emailVerificationToken: string): Promise<void>;
  deleteAll(): Promise<void>;
}
