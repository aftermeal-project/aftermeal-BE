import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { setNestApp } from '../../src/set-nest-app';
import * as request from 'supertest';
import {
  initializeTransactionalContext,
  StorageDriver,
} from 'typeorm-transactional';
import { AuthController } from '../../src/modules/auth/presentation/auth.controller';
import { AuthService } from '../../src/modules/auth/application/auth.service';

const mockAuthService = {
  login: jest.fn(),
};

describe('AuthController', () => {
  let app: INestApplication;

  beforeAll(async () => {
    initializeTransactionalContext({ storageDriver: StorageDriver.AUTO });
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();
    app = moduleRef.createNestApplication();

    setNestApp(app);
    await app.init();
  });

  describe('login', () => {
    it('유효한 정보로 인증한다.', async () => {
      // when
      const response = await request(app.getHttpServer())
        .post('/v1/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password',
        });

      // then
      expect(response.status).toBe(201);
    });

    it('이메일은 필수값이다.', async () => {
      // when
      const response = await request(app.getHttpServer())
        .post('/v1/auth/login')
        .send({
          password: 'password',
        });

      // then
      expect(response.status).toBe(400);
    });

    it('비밀번호는 필수값이다.', async () => {
      // when
      const response = await request(app.getHttpServer())
        .post('/v1/auth/login')
        .send({
          email: 'test@example.com',
        });

      // then
      expect(response.status).toBe(400);
    });
  });
});
