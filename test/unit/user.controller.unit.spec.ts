import { UserService } from '../../src/modules/user/application/user.service';
import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../../src/modules/user/presentation/user.controller';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { setNestApp } from '@common/middlewares/set-nest-app';

const mockUserService = {
  register: jest.fn(),
};
describe('UserController (Unit)', () => {
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

  it('신규 사용자를 등록한다.', async () => {
    // when
    const response = await request(app.getHttpServer()).post('/v1/users').send({
      email: 'test@example.com',
      name: '테스트',
      userType: '선생님',
      password: 'G$K9Vss9-wNX6jOvY',
    });

    // then
    expect(response.status).toBe(201);
    expect(response.body.message).toBe('등록에 성공했습니다.');
  });

  it('신규 사용자를 등록할 때 이메일은 필수값이다.', async () => {
    // when
    const response = await request(app.getHttpServer()).post('/v1/users').send({
      email: '',
      name: '테스트',
      userType: '선생님',
      password: 'G$K9Vss9-wNX6jOvY',
    });

    // then
    expect(response.status).toBe(400);
    expect(response.body.message[0]).toBe('email must be an email');
  });

  it('신규 사용자를 등록할 때 이메일은 이메일 형식이여야 한다.', async () => {
    // when
    const response = await request(app.getHttpServer()).post('/v1/users').send({
      email: 'email',
      name: '테스트',
      userType: '선생님',
      password: 'G$K9Vss9-wNX6jOvY',
    });

    // then
    expect(response.status).toBe(400);
    expect(response.body.message[0]).toBe('email must be an email');
  });

  it('신규 사용자를 등록할 때 이름은 필수값이다.', async () => {
    // when
    const response = await request(app.getHttpServer()).post('/v1/users').send({
      email: 'test@example.com',
      name: '',
      userType: '선생님',
      password: 'G$K9Vss9-wNX6jOvY',
    });

    // then
    expect(response.status).toBe(400);
    expect(response.body.message[0]).toBe('name should not be empty');
  });

  it('신규 사용자를 등록할 때 비밀번호는 필수값이다.', async () => {
    // when
    const response = await request(app.getHttpServer()).post('/v1/users').send({
      email: 'test@example.com',
      name: '테스트',
      userType: '선생님',
      password: '',
    });

    // then
    expect(response.status).toBe(400);
    expect(response.body.message[0]).toBe('password is not strong enough');
  });

  it('신규 사용자를 등록할 때 비밀번호는 강력해야 한다.', async () => {
    // when
    const response = await request(app.getHttpServer()).post('/v1/users').send({
      email: 'test@example.com',
      name: '테스트',
      userType: '선생님',
      password: '1234',
    });

    // then
    expect(response.status).toBe(400);
    expect(response.body.message[0]).toBe('password is not strong enough');
  });

  it('신규 사용자를 등록할 때 사용자 유형은 필수값이다.', async () => {
    // when
    const response = await request(app.getHttpServer()).post('/v1/users').send({
      email: 'test@example.com',
      name: '테스트',
      userType: '',
      password: 'G$K9Vss9-wNX6jOvY',
    });

    // then
    expect(response.status).toBe(400);
    expect(response.body.message[0]).toBe(
      'userType must be one of the following values: 학생, 선생님',
    );
  });

  it('신규 사용자를 등록할 때 사용자 유형은 "학생" 또는 "선생님" 이여야 한다.', async () => {
    // when
    const response = await request(app.getHttpServer()).post('/v1/users').send({
      email: 'test@example.com',
      name: '테스트',
      userType: '너구리',
      password: 'G$K9Vss9-wNX6jOvY',
    });

    // then
    expect(response.status).toBe(400);
    expect(response.body.message[0]).toBe(
      'userType must be one of the following values: 학생, 선생님',
    );
  });
});
