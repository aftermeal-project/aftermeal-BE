import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/domain/user.entity';
import { UserRole } from '../user/domain/user-role.entity';
import { AuthController } from './presentation/auth.controller';
import { AuthService } from './application/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigType } from '@nestjs/config';
import jwtConfiguration from '@config/jwt.config';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserRole]),
    ConfigModule.forFeature(jwtConfiguration),
    JwtModule.registerAsync({
      imports: [ConfigModule.forFeature(jwtConfiguration)],
      inject: [jwtConfiguration.KEY],
      global: true,
      useFactory: (jwtConfig: ConfigType<typeof jwtConfiguration>) => ({
        secret: jwtConfig.accessToken.secret,
        verifyOptions: {
          issuer: jwtConfig.issuer,
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
