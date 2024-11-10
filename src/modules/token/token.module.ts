import {
  Inject,
  Logger,
  Module,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { TokenService } from './application/services/token.service';
import { JwtModule } from '@nestjs/jwt';
import {
  REDIS_CLIENT,
  TOKEN_REPOSITORY,
} from '@common/constants/dependency-token';
import { ConfigType } from '@nestjs/config';
import redisConfiguration from '@config/redis.config';
import { createClient, RedisClientType } from 'redis';
import { TokenRedisRepository } from '../auth/infrastructure/persistence/token-redis.repository';

@Module({
  imports: [JwtModule.register({ global: true })],
  providers: [
    TokenService,
    {
      provide: REDIS_CLIENT,
      useFactory: async (
        redisConfig: ConfigType<typeof redisConfiguration>,
      ) => {
        return createClient({
          url: `redis://:${redisConfig.password}@${redisConfig.host}:${redisConfig.port}`,
        });
      },
      inject: [redisConfiguration.KEY],
    },
    {
      provide: TOKEN_REPOSITORY,
      useClass: TokenRedisRepository,
    },
  ],
  exports: [REDIS_CLIENT, TokenService],
})
export class TokenModule implements OnModuleInit, OnModuleDestroy {
  private readonly logger: Logger = new Logger(TokenModule.name);

  constructor(
    @Inject(REDIS_CLIENT)
    private readonly client: RedisClientType,
  ) {}

  async onModuleInit() {
    await this.client.connect();
    this.logger.log('Success connected to Token Storage');
  }

  async onModuleDestroy() {
    await this.client.disconnect();
    this.logger.log('Success disconnected from Token Storage');
  }
}
