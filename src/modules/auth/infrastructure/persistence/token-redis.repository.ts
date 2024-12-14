import { RedisClientType } from 'redis';
import { TokenRepository } from '../../domain/repositories/token.repository';
import { Inject } from '@nestjs/common';
import { REDIS_CLIENT } from '@common/constants/dependency-token';

export class TokenRedisRepository implements TokenRepository {
  constructor(
    @Inject(REDIS_CLIENT)
    private readonly client: RedisClientType,
  ) {}

  async findUserIdByRefreshToken(refreshToken: string): Promise<number> {
    const userId: string | null = await this.client.get(
      `refresh_token:${refreshToken}`,
    );

    if (!userId) {
      return null;
    }

    return parseInt(userId, 10);
  }

  async findEmailVerificationCodeByEmail(email: string): Promise<string> {
    return await this.client.get(`email:${email}`);
  }

  async saveRefreshToken(
    refreshToken: string,
    userId: number,
    ttl: number,
  ): Promise<void> {
    await this.client.set(`refresh_token:${refreshToken}`, userId, {
      EX: ttl,
    });
  }

  async saveEmailVerificationCode(
    emailVerificationCode: string,
    email: string,
    ttl: number,
  ): Promise<void> {
    await this.client.set(`email:${email}`, emailVerificationCode, {
      EX: ttl,
    });
  }

  async deleteRefreshToken(refreshToken: string): Promise<void> {
    await this.client.del(`refresh_token:${refreshToken}`);
  }

  async deleteEmailVerificationCode(email: string): Promise<void> {
    await this.client.del(`email:${email}`);
  }

  async deleteAll(): Promise<void> {
    await this.client.flushAll();
  }
}
