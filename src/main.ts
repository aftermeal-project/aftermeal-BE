import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigType } from '@nestjs/config';
import appConfig from '@config/app.config';
import { Logger } from '@nestjs/common';
import { setNestApp } from '@common/middlewares/set-nest-app';
import {
  initializeTransactionalContext,
  StorageDriver,
} from 'typeorm-transactional';

async function bootstrap() {
  initializeTransactionalContext({ storageDriver: StorageDriver.AUTO });

  const app = await NestFactory.create(AppModule, {
    forceCloseConnections: true,
    abortOnError: true,
  });

  setNestApp(app);

  const config = app.get<ConfigType<typeof appConfig>>(appConfig.KEY);
  const port: number = config.port;

  await app.listen(port);

  const logger: Logger = app.get(Logger);
  logger.log(`Application is running on: ${await app.getUrl()}`);
}

void bootstrap();
