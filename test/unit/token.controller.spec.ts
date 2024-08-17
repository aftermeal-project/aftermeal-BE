import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { setNestApp } from '../../src/set-nest-app';
import * as request from 'supertest';
import {
  initializeTransactionalContext,
  StorageDriver,
} from 'typeorm-transactional';
import { TokenController } from '../../src/modules/token/presentation/token.controller';
import { TokenService } from '../../src/modules/token/application/token.service';
import { generateRandomString } from '@common/utils/src/generate-random-string';

const mockTokenService = {
  refresh: jest.fn(),
};

describe('TokenController', () => {
  let app: INestApplication;

  beforeAll(async () => {
    initializeTransactionalContext({ storageDriver: StorageDriver.AUTO });
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [TokenController],
      providers: [
        {
          provide: TokenService,
          useValue: mockTokenService,
        },
      ],
    }).compile();
    app = moduleRef.createNestApplication();

    setNestApp(app);
    await app.init();
  });

  describe('refresh', () => {
    it('토큰을 갱신한다.', async () => {
      // given
      const refreshToken: string = generateRandomString(30);

      // when
      const response = await request(app.getHttpServer())
        .post('/v1/token/refresh')
        .send({ refreshToken });

      // then
      expect(response.status).toBe(201);
    });

    it('리프레시 토큰은 문자열이어야 한다.', async () => {
      // given
      const refreshToken: number = 1234;

      // when
      const response = await request(app.getHttpServer())
        .post('/v1/token/refresh')
        .send({ refreshToken: refreshToken });

      // then
      expect(response.status).toBe(400);
    });
  });
});
