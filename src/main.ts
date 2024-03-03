import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigType } from '@nestjs/config';
import appConfig from '@config/app.config';
import { Logger } from '@nestjs/common';
import { setNestApp } from '@common/utils/src/set-nest-app';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get<ConfigType<typeof appConfig>>(appConfig.KEY);
  const port: number = config.port;
  setNestApp(app);
  await app.listen(port, async () =>
    Logger.log(`Application is running on: ${await app.getUrl()}`),
  );
}
void bootstrap();
