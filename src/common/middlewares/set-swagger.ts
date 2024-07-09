import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';
import { ENVIRONMENT } from '@common/constants';

export function setSwagger(app: INestApplication): void {
  if (process.env.NODE_ENV !== ENVIRONMENT.PRODUCTION) {
    const config = new DocumentBuilder()
      .setTitle('AfterMeal API Docs')
      .setDescription(
        '에프터밀 API 엔드포인트(Endpoint)와 객체 정보, 파라미터, 요청 및 응답 예제를 살펴보세요.',
      )
      .setVersion('1.0')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('', app, document);
  }
}
