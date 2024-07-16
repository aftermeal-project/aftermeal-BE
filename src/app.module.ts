import { Module } from '@nestjs/common';
import { validate } from '@config/env.validation';
import { ConfigModule } from '@nestjs/config';
import appConfiguration from '@config/app.config';
import databaseConfiguration from '@config/database.config';
import emailConfiguration from '@config/email.config';
import jwtConfiguration from '@config/jwt.config';
import cacheConfiguration from '@config/cache.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MysqlProvider } from './database/mysql.provider';
import { AuthModule } from './modules/auth/auth.module';
import { ParticipationModule } from './modules/participation/participation.module';
import { ActivityModule } from './modules/activity/activity.module';
import { UserModule } from './modules/user/user.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from '@common/guards/auth.guard';
import { addTransactionalDataSource } from 'typeorm-transactional';
import { DataSource } from 'typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
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
      dataSourceFactory: async (options): Promise<DataSource> => {
        if (!options) {
          throw new Error('Invalid options passed');
        }
        return addTransactionalDataSource(new DataSource(options));
      },
    }),
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
