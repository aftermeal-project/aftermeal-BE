import { INestApplication, Module } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { setNestApp } from '@common/middlewares/set-nest-app';
import * as request from 'supertest';
import { MemberType } from '../../src/modules/user/domain/member-type';
import { Role } from '../../src/modules/user/domain/role.entity';
import { Generation } from '../../src/modules/generation/domain/generation.entity';
import { User } from '../../src/modules/user/domain/user.entity';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { UserRole } from '../../src/modules/user/domain/user-role.entity';
import { UserModule } from '../../src/modules/user/user.module';
import { UserController } from '../../src/modules/user/presentation/user.controller';
import { UserService } from '../../src/modules/user/application/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Generation, Role, UserRole])],
  controllers: [UserController],
  providers: [UserService],
})
class TestUserModule {}

describe('UserController (E2E)', () => {
  let app: INestApplication;
  let userRepository: Repository<User>;
  let generationRepository: Repository<Generation>;
  let roleRepository: Repository<Role>;
  let userRoleRepository: Repository<Role>;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideModule(UserModule)
      .useModule(TestUserModule)
      .compile();

    userRepository = moduleRef.get(getRepositoryToken(User));
    generationRepository = moduleRef.get(getRepositoryToken(Generation));
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
    await generationRepository.delete({});

    const role: Role = roleRepository.create({
      name: 'ROLE_MEMBER',
    });
    await roleRepository.save(role);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /v1/users', () => {
    it('새로운 학생일 경우 가입에 성공해야합니다.', async () => {
      const generation: Generation = generationRepository.create({
        generationNumber: 8,
        yearOfAdmission: 2024,
        isGraduated: false,
      });
      await generationRepository.save(generation);

      const response = await request(app.getHttpServer())
        .post('/v1/users')
        .send({
          name: '테스트',
          email: 's20041@gsm.hs.kr',
          password: 'G$K9Vss9-wNX6jOvY',
          memberType: MemberType.Student,
          generationNumber: generation.generationNumber,
        });

      expect(response.status).toBe(201);
      expect(response.body.data.id).toBeDefined();
    });

    it('새로운 선생님일 경우 가입에 성공해야합니다.', async () => {
      const response = await request(app.getHttpServer())
        .post('/v1/users')
        .send({
          name: '테스트',
          email: 'test@example.com',
          password: 'G$K9Vss9-wNX6jOvY',
          memberType: MemberType.Teacher,
        });

      expect(response.status).toBe(201);
      expect(response.body.data.id).toBeDefined();
    });

    it('이메일을 입력하지 않을 경우 가입에 실패해야 합니다.', async () => {
      const response = await request(app.getHttpServer())
        .post('/v1/users')
        .send({
          name: '테스트',
          email: null,
          password: 'G$K9Vss9-wNX6jOvY',
          memberType: MemberType.Teacher,
        });

      expect(response.status).toBe(400);
    });

    it('이메일에 "@" 기호가 누락될 경우 가입에 실패해야 합니다.', async () => {
      const response = await request(app.getHttpServer())
        .post('/v1/users')
        .send({
          name: '테스트',
          email: 'test@examplecom',
          password: 'G$K9Vss9-wNX6jOvY',
          memberType: MemberType.Teacher,
        });

      expect(response.status).toBe(400);
    });

    it('이메일에 잘못된 문자가 포함될 경우 가입에 실패해야 합니다.', async () => {
      const response = await request(app.getHttpServer())
        .post('/v1/users')
        .send({
          name: '테스트',
          email: 'test@example!.com',
          password: 'G$K9Vss9-wNX6jOvY',
          memberType: MemberType.Teacher,
        });

      expect(response.status).toBe(400);
    });

    it('이미 등록된 이메일일 경우 가입에 실패해야 합니다.', async () => {
      const data = {
        name: '테스트',
        email: 'test@example.com',
        password: 'G$K9Vss9-wNX6jOvY',
        memberType: MemberType.Teacher,
      };

      await request(app.getHttpServer()).post('/v1/users').send(data);
      const response = await request(app.getHttpServer())
        .post('/v1/users')
        .send(data);

      expect(response.status).toBe(409);
    });

    it('이름을 입력하지 않을 경우 가입에 실패해야 합니다.', async () => {
      const response = await request(app.getHttpServer())
        .post('/v1/users')
        .send({
          name: null,
          email: 'test@example.com',
          password: 'G$K9Vss9-wNX6jOvY',
          memberType: MemberType.Teacher,
        });

      expect(response.status).toBe(400);
    });

    it('이름의 길이가 40을 초과할 경우 가입에 실패해야 합니다.', async () => {
      const response = await request(app.getHttpServer())
        .post('/v1/users')
        .send({
          name: '타우마타와카탕이항아코아우아우오타마테아투리푸카카피키마웅아호로누쿠포카이웨누아키타나타후',
          email: 'test@example.com',
          password: 'G$K9Vss9-wNX6jOvY',
          memberType: MemberType.Teacher,
        });

      expect(response.status).toBe(400);
    });

    it('비밀번호를 입력하지 않을 경우 가입에 실패해야 합니다.', async () => {
      const response = await request(app.getHttpServer())
        .post('/v1/users')
        .send({
          name: '테스트',
          email: 'test@example.com',
          password: null,
          memberType: MemberType.Teacher,
        });

      expect(response.status).toBe(400);
    });

    it('비밀번호가 강력하지 않을 경우 가입에 실패해야 합니다.', async () => {
      const response = await request(app.getHttpServer())
        .post('/v1/users')
        .send({
          name: '테스트',
          email: 'test@example.com',
          password: '1234',
          memberType: MemberType.Teacher,
        });

      expect(response.status).toBe(400);
    });

    it('회원 유형을 입력하지 않을 경우 가입에 실패해야 합니다.', async () => {
      const response = await request(app.getHttpServer())
        .post('/v1/users')
        .send({
          name: '테스트',
          email: 'test@example.com',
          password: 'G$K9Vss9-wNX6jOvY',
          memberType: null,
        });

      expect(response.status).toBe(400);
    });

    it('회원 유형이 "학생" 또는 "선생님"이 아닐 경우 가입에 실패해야 합니다.', async () => {
      const response = await request(app.getHttpServer())
        .post('/v1/users')
        .send({
          name: '테스트',
          email: 'test@example.com',
          password: 'G$K9Vss9-wNX6jOvY',
          memberType: 'hi',
        });

      expect(response.status).toBe(400);
    });

    it('학생이 기수를 입력하지 않을 경우 가입에 실패해야 합니다.', async () => {
      const response = await request(app.getHttpServer())
        .post('/v1/users')
        .send({
          name: '테스트',
          email: 'test@example.com',
          password: 'G$K9Vss9-wNX6jOvY',
          memberType: MemberType.Student,
        });

      expect(response.status).toBe(400);
    });

    it('학생이 학교 이메일이 아닌 경우 가입에 실패해야 합니다.', async () => {
      const generation: Generation = generationRepository.create({
        generationNumber: 8,
        yearOfAdmission: 2024,
        isGraduated: false,
      });
      await generationRepository.save(generation);

      const response = await request(app.getHttpServer())
        .post('/v1/users')
        .send({
          name: '테스트',
          email: 'test@example.com',
          password: 'G$K9Vss9-wNX6jOvY',
          memberType: MemberType.Student,
          generationNumber: generation.generationNumber,
        });

      expect(response.status).toBe(400);
    });

    it('졸업한 학생일 경우 가입에 실패해야 합니다.', async () => {
      const generation: Generation = generationRepository.create({
        generationNumber: 1,
        yearOfAdmission: 2017,
        isGraduated: true,
      });
      await generationRepository.save(generation);

      const response = await request(app.getHttpServer())
        .post('/v1/users')
        .send({
          name: '테스트',
          email: 's20041@gsm.hs.kr',
          password: 'G$K9Vss9-wNX6jOvY',
          memberType: MemberType.Student,
          generationNumber: generation.generationNumber,
        });

      expect(response.status).toBe(400);
    });
  });
});
