export interface RefreshTokenRepository {
  findByRefreshToken(refreshToken: string): Promise<number>;
  save(refreshToken: string, userId: number, ttl: number): Promise<void>;
  delete(refreshToken: string): Promise<void>;
  deleteAll(): Promise<void>;
}
