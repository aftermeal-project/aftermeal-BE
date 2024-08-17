import { Module } from '@nestjs/common';
import { TokenService } from './application/token.service';
import { TOKEN_REPOSITORY } from '@common/constants';
import { RefreshTokenRedisRepository } from './infrastructure/refresh-token-redis.repository';
import { TokenStorageModule } from './token-storage.module';
import { JwtModule } from '@nestjs/jwt';
import { TokenController } from './presentation/token.controller';
import { UserModule } from '../user/user.module';
import { RoleModule } from '../role/role.module';

@Module({
  imports: [
    TokenStorageModule,
    JwtModule.register({ global: true }),
    UserModule,
    RoleModule,
  ],
  controllers: [TokenController],
  providers: [
    TokenService,
    {
      provide: TOKEN_REPOSITORY,
      useClass: RefreshTokenRedisRepository,
    },
  ],
  exports: [TokenService],
})
export class TokenModule {}
