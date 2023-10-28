import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validate } from './config/env.validation';
import appConfig from './config/app.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import databaseConfig from './config/database.config';
import { TypeOrmConfig } from './config/type-orm.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: process.env.NODE_ENV == 'production' ? '.env.production' : '.env.development',
      load: [appConfig],
      validate: validate,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule.forFeature(databaseConfig)],
      useClass: TypeOrmConfig,
    }),
  ],
})
export class AppModule {}
