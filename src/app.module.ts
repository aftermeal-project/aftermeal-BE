import { Module } from '@nestjs/common';
import { validate } from '@config/env.validation';
import { ConfigModule } from '@nestjs/config';
import appConfiguration from '@config/app.config';
import databaseConfiguration from '@config/database.config';
import emailConfiguration from '@config/email.config';
import tokenConfiguration from '@config/token.config';
import redisConfiguration from '@config/redis.config';
import { AuthModule } from './modules/auth/auth.module';
import { ParticipationModule } from './modules/participation/participation.module';
import { ActivityModule } from './modules/activity/activity.module';
import { UserModule } from './modules/user/user.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { DatabaseModule } from '@common/infrastructure/database/database.module';
import { RolesGuard } from '@common/guards/roles.guard';
import { TokenModule } from './modules/token/token.module';
import { LoggerModule } from '@common/infrastructure/logger/logger.module';
import { ClsModule } from 'nestjs-cls';
import { v4 as uuidv4 } from 'uuid';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      load: [
        appConfiguration,
        databaseConfiguration,
        tokenConfiguration,
        emailConfiguration,
        redisConfiguration,
      ],
      isGlobal: true,
      validate: validate,
    }),
    ClsModule.forRoot({
      global: true,
      middleware: {
        mount: true,
        generateId: true,
        idGenerator: () => uuidv4(),
        setup: (cls, req) => {
          cls.set('url', req.originalUrl);
          cls.set('method', req.method);
        },
      },
    }),
    DatabaseModule,
    LoggerModule,
    UserModule,
    AuthModule,
    TokenModule,
    ActivityModule,
    ParticipationModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useExisting: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useExisting: RolesGuard,
    },
  ],
})
export class AppModule {}
