import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigType } from '@nestjs/config';
import appConfig from '@config/app.config';
import { CustomLoggerService } from '@common/logger/custom-logger.service';
import { WINSTON_LOGGER } from '@common/constants/dependency-token';
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
    logger: ['error', 'warn'],
  });

  await setNestApp(app);

  const logger = await app.resolve<CustomLoggerService>(WINSTON_LOGGER);
  const config = app.get<ConfigType<typeof appConfig>>(appConfig.KEY);

  await app.listen(config.port);
  logger.setContext('Main');
  logger.info(`Application is running on: ${await app.getUrl()}`);
}

void bootstrap();
