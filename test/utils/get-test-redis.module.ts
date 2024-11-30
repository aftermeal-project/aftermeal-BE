import { Inject, Module, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { REDIS_CLIENT } from '@common/constants/dependency-token';
import { createClient, RedisClientType } from 'redis';

/**
 * 테스트 Redis 가져오기
 *
 */
@Module({
  providers: [
    {
      provide: REDIS_CLIENT,
      useValue: createClient({
        url: 'redis://:test@localhost:6379',
      }),
    },
  ],
  exports: [REDIS_CLIENT],
})
export class TestRedisModule implements OnModuleInit, OnModuleDestroy {
  constructor(
    @Inject(REDIS_CLIENT)
    private readonly client: RedisClientType,
  ) {}

  async onModuleInit() {
    await this.client.connect();
  }

  async onModuleDestroy() {
    await this.client.disconnect();
  }
}
