import {
  ClassSerializerInterceptor,
  INestApplication,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GlobalExceptionFilter } from '@common/filters/global-exception.filter';
import { ValidationException } from '@common/exceptions/validation.exception';
import { BaseExceptionFilter } from '@common/filters/base-exception.filter';
import { WINSTON_LOGGER } from '@common/constants/dependency-token';
import { CustomLoggerService } from '@common/logger/custom-logger.service';

/**
 * E2E 테스트에서도 실 서비스와 동일한 설정을 위해 글로벌 미들웨어 구성을 모아두는 함수입니다.
 * @param {INestApplication} app
 */
export async function setNestApp<T extends INestApplication>(
  app: T,
): Promise<void> {
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      transform: true,
      stopAtFirstError: true,
      exceptionFactory: (errors) => {
        const [message] = Object.values(errors[0].constraints);
        return new ValidationException(message);
      },
    }),
  );

  const logger = await app.resolve<CustomLoggerService>(WINSTON_LOGGER);

  app.useGlobalFilters(
    new GlobalExceptionFilter(logger),
    new BaseExceptionFilter(logger),
  );
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });
  app.enableCors();
  app.enableShutdownHooks();
}
