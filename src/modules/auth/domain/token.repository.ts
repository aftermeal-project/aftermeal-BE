export interface TokenRepository {
  save(userId: number, token: string): Promise<any>;
  getByUserId(userId: number): Promise<any>;
}
