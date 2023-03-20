import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import appConfig from './config/app/app.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: false });

  const config = app.get<ConfigType<typeof appConfig>>(appConfig.KEY);
  const port: number = config.port;
  const host: string = config.host;
  await app.listen(port, host, async () =>
    Logger.log(`Application is running on: ${await app.getUrl()}`),
  );
}

void bootstrap();
