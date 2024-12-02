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

  async findEmailByEmailVerificationCode(
    emailVerificationCode: string,
  ): Promise<string> {
    return await this.client.get(
      `email_verification_code:${emailVerificationCode}`,
    );
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
    await this.client.set(
      `email_verification_code:${emailVerificationCode}`,
      email,
      {
        EX: ttl,
      },
    );
  }

  async deleteRefreshToken(refreshToken: string): Promise<void> {
    await this.client.del(`refresh_token:${refreshToken}`);
  }

  async deleteEmailVerificationCode(
    emailVerificationCode: string,
  ): Promise<void> {
    await this.client.del(`email_verification_code:${emailVerificationCode}`);
  }

  async deleteAll(): Promise<void> {
    await this.client.flushAll();
  }
}
