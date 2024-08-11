import { Module } from '@nestjs/common';
import { AuthController } from './presentation/auth.controller';
import { AuthService } from './application/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { TOKEN_REPOSITORY } from '@common/constants';
import { TokenRedisRepository } from './infrastructure/token-redis.repository';
import { RoleModule } from '../role/role.module';
import { TokenService } from './application/token.service';
import { TokenStorageModule } from '../../database/token-storage.module';

@Module({
  imports: [
    JwtModule.register({ global: true }),
    UserModule,
    RoleModule,
    TokenStorageModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    TokenService,
    {
      provide: TOKEN_REPOSITORY,
      useClass: TokenRedisRepository,
    },
  ],
})
export class AuthModule {}
