export interface TokenRepository {
  findByRefreshToken(refreshToken: string): Promise<number>;
  save(refreshToken: string, userId: number, ttl: number): Promise<void>;
  exist(refreshToken: string): Promise<boolean>;
  delete(refreshToken: string): Promise<void>;
}
