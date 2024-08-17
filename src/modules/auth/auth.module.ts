import { Module } from '@nestjs/common';
import { AuthController } from './presentation/auth.controller';
import { AuthService } from './application/auth.service';
import { TokenModule } from '../token/token.module';
import { UserModule } from '../user/user.module';
import { RoleModule } from '../role/role.module';

@Module({
  imports: [TokenModule, UserModule, RoleModule],
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
