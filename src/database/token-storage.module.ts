import {
  Inject,
  Logger,
  Module,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { createClient, RedisClientType } from 'redis';
import redisConfiguration from '@config/redis.config';
import { REDIS_CLIENT } from '@common/constants';

@Module({
  providers: [
    {
      provide: REDIS_CLIENT,
      useFactory: async (
        redisConfig: ConfigType<typeof redisConfiguration>,
      ) => {
        return createClient({
          url: `redis://${redisConfig.host}:${redisConfig.port}`,
        });
      },
      inject: [redisConfiguration.KEY],
    },
  ],
  exports: [REDIS_CLIENT],
})
export class TokenStorageModule implements OnModuleInit, OnModuleDestroy {
  private readonly logger: Logger = new Logger(TokenStorageModule.name);

  constructor(
    @Inject(REDIS_CLIENT)
    private readonly client: RedisClientType,
  ) {}

  async onModuleInit() {
    try {
      this.logger.log('Connecting to Token Storage');
      await this.client.connect();
    } catch (error) {
      this.logger.error('Failed to connect to Token Storage', error.stack);
      throw error;
    }
  }

  async onModuleDestroy() {
    try {
      this.logger.log('Disconnecting from Token Storage');
      await this.client.disconnect();
    } catch (error) {
      this.logger.error('Failed to disconnect from Token Storage', error.stack);
      throw error;
    }
  }
}
