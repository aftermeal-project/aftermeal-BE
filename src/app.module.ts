import { Module } from '@nestjs/common';
import { validate } from '@config/env.validation';
import { ConfigModule } from '@nestjs/config';
import appConfiguration from '@config/app.config';
import databaseConfiguration from '@config/database.config';
import emailConfiguration from '@config/email.config';
import jwtConfiguration from '@config/jwt.config';
import cacheConfiguration from '@config/cache.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MysqlProvider } from './providers/database/mysql.provider';
import { AuthModule } from './modules/auth/auth.module';
import { VoteModule } from './modules/vote/vote.module';
import { ParticipationModule } from './modules/participation/participation.module';
import { ActivityModule } from './modules/activity/activity.module';
import { UserModule } from './modules/user/user.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from '@common/guard/auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      envFilePath:
        process.env.NODE_ENV == 'production'
          ? '.env.production'
          : '.env.development',
      load: [
        appConfiguration,
        databaseConfiguration,
        jwtConfiguration,
        emailConfiguration,
        cacheConfiguration,
      ],
      validate: validate,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule.forFeature(databaseConfiguration)],
      inject: [databaseConfiguration.KEY],
      useClass: MysqlProvider,
    }),
    UserModule,
    AuthModule,
    ActivityModule,
    VoteModule,
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
