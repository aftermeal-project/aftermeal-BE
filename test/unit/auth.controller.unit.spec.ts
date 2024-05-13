import { INestApplication } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { setNestApp } from '@common/middlewares/set-nest-app';
import * as request from 'supertest';
import { User } from '../../src/modules/user/domain/user.entity';
import { UserRole } from '../../src/modules/user/domain/user-role.entity';
import { Role } from '../../src/modules/user/domain/role.entity';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../../src/modules/auth/auth.module';
import { UserStatus } from '../../src/modules/user/domain/user-status';
import { EUserType } from '../../src/modules/user/domain/user-type';
import { getTestMysqlModule } from '../get-test-mysql.module';
import {
  initializeTransactionalContext,
  StorageDriver,
} from 'typeorm-transactional';
import { ConfigModule } from '@nestjs/config';

describe('AuthController (Unit)', () => {
  let app: INestApplication;
  let userRepository: Repository<User>;
  let roleRepository: Repository<Role>;
  let userRoleRepository: Repository<UserRole>;
  let dataSource: DataSource;

  beforeAll(async () => {
    initializeTransactionalContext({ storageDriver: StorageDriver.AUTO });
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        getTestMysqlModule(),
        ConfigModule.forRoot({
          envFilePath:
            process.env.NODE_ENV == 'production'
              ? '.env.production'
              : '.env.development',
        }),
        AuthModule,
        TypeOrmModule.forFeature([User, UserRole]),
      ],
    }).compile();

    userRepository = moduleRef.get(getRepositoryToken(User));
    roleRepository = moduleRef.get(getRepositoryToken(Role));
    userRoleRepository = moduleRef.get(getRepositoryToken(UserRole));
    dataSource = moduleRef.get(DataSource);
    app = moduleRef.createNestApplication();

    setNestApp(app);
    await app.init();
  });

  afterEach(async () => {
    await userRoleRepository.delete({});
    await roleRepository.delete({});
    await userRepository.delete({});
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  describe('login', () => {
    it('유효한 정보를 입력할 경우 인증에 성공해야 합니다.', async () => {
      // given
      const role: Role = roleRepository.create({
        name: 'ROLE_MEMBER',
      });
      await roleRepository.save(role);

      const user: User = User.create(
        '송유현',
        'test@example.com',
        EUserType.TEACHER,
        role,
        UserStatus.Activate,
        'password',
      );
      await userRepository.save(user);

      // when
      const response = await request(app.getHttpServer())
        .post('/v1/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password',
        });

      // then
      expect(response.status).toBe(201);
      // TODO: how to test this? or we don't need to test?
      expect(response.body.data.accessToken).toBeDefined();
      expect(response.body.data.expiredIn).toBeDefined();
      expect(response.body.data.tokenType).toBe('Bearer');
    });

    it('이메일을 입력하지 않으면 오류가 발생한다.', async () => {
      // when
      const response = await request(app.getHttpServer())
        .post('/v1/auth/login')
        .send({
          password: 'password',
        });

      // then
      expect(response.status).toBe(400);
      expect(response.body.message[0]).toBe('email should not be empty');
    });

    it('비밀번호를 입력하지 않으면 오류가 발생한다.', async () => {
      const response = await request(app.getHttpServer())
        .post('/v1/auth/login')
        .send({
          email: 'test@example.com',
        });

      expect(response.status).toBe(400);
      expect(response.body.message[0]).toBe('password should not be empty');
    });
  });
});
