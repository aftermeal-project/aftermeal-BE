import { Module } from '@nestjs/common';
import { validate } from '@config/env.validation';
import { ConfigModule } from '@nestjs/config';
import appConfiguration from '@config/app.config';
import databaseConfiguration from '@config/database.config';
import emailConfiguration from '@config/email.config';
import jwtConfiguration from '@config/jwt.config';
import { InvitationModule } from './modules/invitation/invitation.module';
import cacheConfiguration from '@config/cache.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MysqlProvider } from './providers/database/mysql.provider';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
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
      useClass: MysqlProvider,
      inject: [databaseConfiguration.KEY, appConfiguration.KEY],
    }),
    InvitationModule,
    AuthModule,
  ],
})
export class AppModule {}
