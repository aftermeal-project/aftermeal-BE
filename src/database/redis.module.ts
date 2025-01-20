import { Module } from '@nestjs/common';
import {
  REDIS_CLIENT,
  WINSTON_LOGGER,
} from '@common/constants/dependency-token';
import { ConfigType } from '@nestjs/config';
import redisConfiguration from '@config/redis.config';
import { createClient, RedisClientType } from 'redis';
import { CustomLoggerService } from '@common/logger/custom-logger.service';

@Module({
  providers: [
    {
      provide: REDIS_CLIENT,
      useFactory: async (
        redisConfig: ConfigType<typeof redisConfiguration>,
        logger: CustomLoggerService,
      ): Promise<RedisClientType> => {
        logger.setContext(RedisModule.name);
        let isDisconnected: boolean = false;

        const client: RedisClientType = createClient({
          socket: {
            host: redisConfig.host,
            port: redisConfig.port,
            reconnectStrategy: (retries, cause) => {
              if (cause?.message?.includes('WRONGPASS' || 'NOAUTH')) {
                logger.error(
                  'Redis 서버에 제공된 사용자 이름 또는 비밀번호가 잘못되었습니다.',
                  cause.stack,
                );
                isDisconnected = true;
                return false;
              }

              if (retries >= 10) {
                logger.warn('재연결 시도 횟수를 초과하여 연결을 중단합니다.');
                isDisconnected = true;
                return false;
              }

              logger.warn(`Redis 재연결 시도 중.. ${retries}`);
              return retries * 500; // 지수 백오프
            },
            connectTimeout: 10000,
          },
          username: redisConfig.user,
          password: redisConfig.password,
        });

        client.on('error', (e) => {
          if (isDisconnected) {
            return;
          }

          if (e instanceof AggregateError) {
            logger.error(
              'Redis 클라이언트 오류 발생',
              e.errors.map((error) => error.stack + '\n').join(''),
              RedisModule.name,
            );
          } else {
            logger.error(
              'Redis 클라이언트 오류 발생',
              e.stack,
              RedisModule.name,
            );
          }
        });

        try {
          await client.connect();
        } catch (error) {
          logger.info(`Redis 연결에 실패하여 Fallback을 수행합니다.`);
          return null;
        }

        return client;
      },
      inject: [redisConfiguration.KEY, WINSTON_LOGGER],
    },
  ],
  exports: [REDIS_CLIENT],
})
export class RedisModule {}
