import { RedisClientType } from 'redis';
import { TokenRepository } from '../domain/token.repository';
import { Inject } from '@nestjs/common';
import { REDIS_CLIENT } from '@common/constants';

export class RefreshTokenRedisRepository implements TokenRepository {
  constructor(
    @Inject(REDIS_CLIENT)
    private readonly client: RedisClientType,
  ) {}

  async findByRefreshToken(refreshToken: string): Promise<number> {
    const userId: string | null = await this.client.get(
      `refreshToken:${refreshToken}`,
    );
    return parseInt(userId);
  }

  async save(refreshToken: string, userId: number, ttl: number): Promise<void> {
    await this.client.set(`refreshToken:${refreshToken}`, userId, {
      EX: ttl,
    });
  }

  async exist(refreshToken: string): Promise<boolean> {
    const userId: string | null = await this.client.get(
      `refreshToken:${refreshToken}`,
    );
    return !!userId;
  }

  async delete(refreshToken: string): Promise<void> {
    await this.client.del(`refreshToken:${refreshToken}`);
  }
}
