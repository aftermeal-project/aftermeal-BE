import {
  ClassSerializerInterceptor,
  INestApplication,
  Logger,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GlobalExceptionFilter } from '@common/filters/global-exception.filter';
import { ValidationException } from '@common/exceptions/validation.exception';
import { BaseExceptionFilter } from '@common/filters/base-exception.filter';

/**
 * E2E 테스트에서도 실 서비스와 동일한 설정을 위해 글로벌 미들웨어 구성을 모아두는 함수입니다.
 * @param {INestApplication} app
 */
export function setNestApp<T extends INestApplication>(app: T): void {
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
  app.useLogger(app.get(Logger));
  app.useGlobalFilters(
    new GlobalExceptionFilter(app.get(Logger)),
    new BaseExceptionFilter(app.get(Logger)),
  );
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });
  app.enableCors();
  app.enableShutdownHooks();
}
