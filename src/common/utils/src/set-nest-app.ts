import { ClassSerializerInterceptor, INestApplication } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

/**
 * 글로벌 미들웨어 구성을 모아두는 함수입니다.
 * 모노레포 환경에서 여러 모듈에서 공통적으로 사용하고,
 * E2E (End To End) 테스트에서도 실 서비스와 동일한 인터셉터 설정을 위해 공통적으로 사용하기 위함
 * @param {INestApplication} app
 */
export function setNestApp<T extends INestApplication>(app: T): void {
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.enableCors();
}
