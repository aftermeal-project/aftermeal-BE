import { INestApplication, Module } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { setNestApp } from '@common/middlewares/set-nest-app';
import * as request from 'supertest';
import { User } from '../../src/modules/user/domain/user.entity';
import { EUserType } from '../../src/modules/user/domain/user-type';
import { UserRole } from '../../src/modules/user/domain/user-role.entity';
import { Role } from '../../src/modules/user/domain/role.entity';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from '../../src/modules/user/presentation/user.controller';
import { UserService } from '../../src/modules/user/application/user.service';
import { UserModule } from '../../src/modules/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role, UserRole])],
  controllers: [UserController],
  providers: [UserService],
})
class TestUserModule {}

describe('AuthController (E2E)', () => {
  let app: INestApplication;
  let userRepository: Repository<User>;
  let roleRepository: Repository<Role>;
  let userRoleRepository: Repository<UserRole>;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideModule(UserModule)
      .useModule(TestUserModule)
      .compile();

    userRepository = moduleRef.get(getRepositoryToken(User));
    roleRepository = moduleRef.get(getRepositoryToken(Role));
    userRoleRepository = moduleRef.get(getRepositoryToken(UserRole));
    app = moduleRef.createNestApplication();

    setNestApp(app);
    await app.init();
  });

  beforeEach(async () => {
    await userRoleRepository.delete({});
    await roleRepository.delete({});
    await userRepository.delete({});

    const role: Role = roleRepository.create({
      name: 'ROLE_MEMBER',
    });
    await roleRepository.save(role);

    await request(app.getHttpServer()).post('/v1/users').send({
      name: '테스트',
      email: 'test@example.com',
      password: 'G$K9Vss9-wNX6jOvY',
      memberType: EUserType.TEACHER,
    });
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /v1/auth/login', () => {
    it('유효한 정보를 입력할 경우 인증에 성공해야 합니다.', async () => {
      const response = await request(app.getHttpServer())
        .post('/v1/auth/login')
        .send({
          email: 'test@example.com',
          password: 'G$K9Vss9-wNX6jOvY',
        });

      expect(response.status).toBe(201);
      expect(response.body.data.accessToken).toBeDefined();
      expect(response.body.data.expiredIn).toBeDefined();
      expect(response.body.data.tokenType).toBeDefined();
    });
  });

  it('등록되지 않은 이메일일 경우 인증에 실패해야 합니다.', async () => {
    const response = await request(app.getHttpServer())
      .post('/v1/auth/login')
      .send({
        email: 'notexist@example.com',
        password: 'G$K9Vss9-wNX6jOvY',
      });

    expect(response.status).toBe(404);
  });

  it('비밀번호가 일치하지 않을 경우 인증에 실패해야 합니다.', async () => {
    const response = await request(app.getHttpServer())
      .post('/v1/auth/login')
      .send({
        email: 'test@example.com',
        password: 'wrongpassword',
      });

    expect(response.status).toBe(400);
  });

  it('이메일을 입력하지 않을 경우 인증에 실패해야 합니다.', async () => {
    const response = await request(app.getHttpServer())
      .post('/v1/auth/login')
      .send({
        email: null,
        password: 'G$K9Vss9-wNX6jOvY',
      });

    expect(response.status).toBe(400);
  });

  it('비밀번호를 입력하지 않을 경우 인증에 실패해야 합니다.', async () => {
    const response = await request(app.getHttpServer())
      .post('/v1/auth/login')
      .send({
        email: 'test@example.com',
        password: null,
      });

    expect(response.status).toBe(400);
  });
});
