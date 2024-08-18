import { Module } from '@nestjs/common';
import { validate } from '@config/env.validation';
import { ConfigModule } from '@nestjs/config';
import appConfiguration from '@config/app.config';
import databaseConfiguration from '@config/database.config';
import emailConfiguration from '@config/email.config';
import jwtConfiguration from '@config/jwt.config';
import redisConfiguration from '@config/redis.config';
import { AuthModule } from './modules/auth/auth.module';
import { ParticipationModule } from './modules/participation/participation.module';
import { ActivityModule } from './modules/activity/activity.module';
import { UserModule } from './modules/user/user.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './modules/auth/presentation/guards/auth.guard';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      load: [
        appConfiguration,
        databaseConfiguration,
        jwtConfiguration,
        emailConfiguration,
        redisConfiguration,
      ],
      isGlobal: true,
      validate: validate,
    }),
    DatabaseModule,
    UserModule,
    AuthModule,
    ActivityModule,
    ParticipationModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
