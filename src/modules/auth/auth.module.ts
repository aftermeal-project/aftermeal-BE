import {
  Inject,
  Logger,
  Module,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { AuthController } from './presentation/controllers/auth.controller';
import { AuthService } from './application/auth.service';
import { UserModule } from '../user/user.module';
import { RoleModule } from '../role/role.module';
import { REDIS_CLIENT, REFRESH_TOKEN_REPOSITORY } from '@common/constants';
import { ConfigType } from '@nestjs/config';
import redisConfiguration from '@config/redis.config';
import { createClient, RedisClientType } from 'redis';
import { TokenService } from './application/token.service';
import { JwtModule } from '@nestjs/jwt';
import { RefreshTokenRedisRepository } from './infrastructure/refresh-token-redis.repository';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './presentation/guards/auth.guard';

@Module({
  imports: [JwtModule.register({ global: true }), UserModule, RoleModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    TokenService,
    AuthGuard,
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
      provide: REFRESH_TOKEN_REPOSITORY,
      useClass: RefreshTokenRedisRepository,
    },
  ],
  exports: [REDIS_CLIENT, AuthGuard],
})
export class AuthModule implements OnModuleInit, OnModuleDestroy {
  private readonly logger: Logger = new Logger(AuthModule.name);

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
