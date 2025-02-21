import {
  ClassSerializerInterceptor,
  Module,
  ValidationPipe,
} from '@nestjs/common';
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
import { DatabaseModule } from '@common/infrastructure/database/database.module';
import { TokenModule } from './modules/token/token.module';
import { LoggerModule } from '@common/infrastructure/logger/logger.module';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { RolesGuard } from '@common/guards/roles.guard';
import { ValidationException } from '@common/exceptions/validation.exception';
import { BusinessExceptionFilter } from '@common/filters/business-exception.filter';
import { CatchEverythingFilter } from '@common/filters/catch-everything.filter';
import { ClsModule } from 'nestjs-cls';
import { v4 as uuidv4 } from 'uuid';
import { HttpExceptionFilter } from '@common/filters/http-exception.filter';

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
        setup: (cls, req) => {
          cls.set('requestID', req.get('X-Request-ID') || uuidv4());
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
    {
      provide: APP_FILTER,
      useClass: CatchEverythingFilter,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: BusinessExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        forbidUnknownValues: true,
        transform: true,
        stopAtFirstError: true,
        exceptionFactory: (errors) => {
          const [message] = Object.values(errors[0].constraints);
          return new ValidationException(message);
        },
      }),
    },
  ],
})
export class AppModule {}
