import { RedisClientType } from 'redis';
import { TokenRepository } from '../domain/token.repository';
import { Inject } from '@nestjs/common';
import { REDIS_CLIENT } from '@common/constants';

export class TokenRedisRepository implements TokenRepository {
  constructor(
    @Inject(REDIS_CLIENT)
    private readonly client: RedisClientType,
  ) {}

  async save(userId: number, token: string): Promise<void> {
    const ttl: number = 60 * 60 * 24 * 30;
    await this.client.set(userId.toString(), token, { EX: ttl });
  }

  async getByUserId(userId: number): Promise<string> {
    return this.client.get(userId.toString());
  }
}
