import { UserService } from '../../src/modules/user/application/user.service';
import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../../src/modules/user/presentation/user.controller';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { setNestApp } from '../../src/set-nest-app';
import { UserType } from '../../src/modules/user/domain/user-type';

const mockUserService = {
  register: jest.fn(),
};
describe('UserController', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();
    app = moduleRef.createNestApplication();

    setNestApp(app);
    await app.init();
  });

  describe('POST /v1/users', () => {
    it('신규 사용자를 등록한다.', async () => {
      // when
      const response = await request(app.getHttpServer())
        .post('/v1/users')
        .send({
          email: 'test@example.com',
          name: '테스트',
          type: 'TEACHER',
          password: 'G$K9Vss9-wNX6jOvY',
        });

      // then
      expect(response.status).toBe(201);
    });

    it('이메일은 이메일 형식이어야 한다.', async () => {
      // when
      const response = await request(app.getHttpServer())
        .post('/v1/users')
        .send({
          email: 'email',
          name: '테스트',
          type: 'TEACHER',
          password: 'G$K9Vss9-wNX6jOvY',
        });

      // then
      expect(response.status).toBe(400);
    });

    it('이름은 필수값이다.', async () => {
      // when
      const response = await request(app.getHttpServer())
        .post('/v1/users')
        .send({
          email: 'test@example.com',
          name: null,
          type: 'TEACHER',
          password: 'G$K9Vss9-wNX6jOvY',
        });

      // then
      expect(response.status).toBe(400);
    });

    it(`사용자 유형은 다음 값 중에 하나여야 한다: ${Object.values(UserType)}`, async () => {
      // when
      const response = await request(app.getHttpServer())
        .post('/v1/users')
        .send({
          email: 'test@example.com',
          name: '테스트',
          type: '너구리',
          password: 'G$K9Vss9-wNX6jOvY',
        });

      // then
      expect(response.status).toBe(400);
    });

    it('비밀번호는 필수값이다.', async () => {
      // when
      const response = await request(app.getHttpServer())
        .post('/v1/users')
        .send({
          email: 'test@example.com',
          name: '테스트',
          type: 'TEACHER',
          password: null,
        });

      // then
      expect(response.status).toBe(400);
    });
  });
});
