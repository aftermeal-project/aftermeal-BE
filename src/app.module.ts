import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validate } from './global/config/env.validation';
import appConfig from './global/config/app/app.config';
import { DatabaseModule } from './global/config/database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      ignoreEnvFile: process.env.NODE_ENV === 'production',
      load: [appConfig],
      validate: validate,
    }),
    DatabaseModule,
  ],
})
export class AppModule {}
