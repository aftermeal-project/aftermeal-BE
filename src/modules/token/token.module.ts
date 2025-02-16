import { Module } from '@nestjs/common';
import { TokenService } from './application/services/token.service';
import { JwtModule } from '@nestjs/jwt';
import { TOKEN_REPOSITORY } from '@common/constants/dependency-token';
import { TokenRedisRepository } from '../auth/infrastructure/persistence/token-redis.repository';
import { RedisModule } from '@common/infrastructure/database/redis.module';

@Module({
  imports: [RedisModule, JwtModule.register({ global: true })],
  providers: [
    TokenService,
    {
      provide: TOKEN_REPOSITORY,
      useClass: TokenRedisRepository,
    },
  ],
  exports: [TokenService],
})
export class TokenModule {}
