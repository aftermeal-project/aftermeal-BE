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

  async findEmailByEmailVerificationToken(
    emailVerificationToken: string,
  ): Promise<string> {
    const email = await this.client.get(
      `email_verification_token:${emailVerificationToken}`,
    );

    if (!email) {
      return null;
    }

    return email;
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

  async saveEmailVerificationToken(
    emailVerificationToken: string,
    email: string,
    ttl: number,
  ): Promise<void> {
    await this.client.set(
      `email_verification_token:${emailVerificationToken}`,
      email,
      {
        EX: ttl,
      },
    );
  }

  async deleteRefreshToken(refreshToken: string): Promise<void> {
    await this.client.del(`refresh_token:${refreshToken}`);
  }

  async deleteEmailVerificationToken(
    emailVerificationToken: string,
  ): Promise<void> {
    await this.client.del(`email_verification_token:${emailVerificationToken}`);
  }

  async deleteAll(): Promise<void> {
    await this.client.flushAll();
  }
}
