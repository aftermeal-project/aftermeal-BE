import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigType } from '@nestjs/config';
import appConfig from '@config/app.config';
import { Logger } from '@nestjs/common';
import { setNestApp } from '@common/middlewares/set-nest-app';
import { setSwagger } from '@common/middlewares/set-swagger';
import {
  initializeTransactionalContext,
  StorageDriver,
} from 'typeorm-transactional';
import * as process from 'process';

async function bootstrap() {
  initializeTransactionalContext({ storageDriver: StorageDriver.AUTO });
  const app = await NestFactory.create(AppModule, {
    forceCloseConnections: true,
    abortOnError: true,
  });
  const logger = new Logger('Bootstrap');
  const config = app.get<ConfigType<typeof appConfig>>(appConfig.KEY);
  const port: number = config.port;

  setNestApp(app);
  setSwagger(app);

  await app.listen(port, async () => {
    if (process.send) {
      process.send('ready');
    }
    logger.log(`Application is running on: ${await app.getUrl()}`);
  });
}

void bootstrap();
