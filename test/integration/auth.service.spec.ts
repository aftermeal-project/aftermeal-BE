import { DataSource, Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../../src/modules/user/domain/user.entity';
import { Role } from '../../src/modules/role/domain/role.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { getTestMysqlModule } from '../get-test-mysql.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '../../src/modules/auth/auth.module';
import { AuthService } from '../../src/modules/auth/application/auth.service';
import {
  initializeTransactionalContext,
  StorageDriver,
} from 'typeorm-transactional';
import jwtConfig from '@config/jwt.config';
import redisConfig from '@config/redis.config';

describe('AuthService', () => {
  let moduleRef: TestingModule;

  let authService: AuthService;
  let userRepository: Repository<User>;
  let roleRepository: Repository<Role>;
  let dataSource: DataSource;

  beforeAll(async () => {
    initializeTransactionalContext({ storageDriver: StorageDriver.AUTO });

    moduleRef = await Test.createTestingModule({
      imports: [
        getTestMysqlModule(),
        ConfigModule.forRoot({
          load: [jwtConfig, redisConfig],
          isGlobal: true,
        }),
        AuthModule,
      ],
    }).compile();
    await moduleRef.init();

    // System Under Test
    authService = moduleRef.get(AuthService);

    // Dependencies
    userRepository = moduleRef.get(getRepositoryToken(User));
    roleRepository = moduleRef.get(getRepositoryToken(Role));
    dataSource = moduleRef.get(DataSource);
  });

  afterEach(async () => {
    await roleRepository.delete({});
    await userRepository.delete({});
  });

  afterAll(async () => {
    await dataSource.destroy();
    await moduleRef.close();
  });

  describe('login', () => {
    it('유효한 정보를 통해 인증한다.', async () => {
      // given
      const role: Role = Role.create('USER');
      await roleRepository.save(role);

      const email: string = 'test@example.com';
      const password: string = 'G$K9Vss9-wNX6jOvY';

      const user: User = User.createTeacher(
        '송유현',
        email,
        Role.create('USER'),
        password,
      );
      await user.hashPassword();
      await userRepository.save(user);

      // when
      const actual = await authService.login({
        email: email,
        password: password,
      });

      // then
      expect(actual.accessToken).toBeDefined();
      expect(actual.expiredIn).toBeDefined();
      expect(actual.tokenType).toBeDefined();
      expect(actual.refreshToken).toBeDefined();
    });
  });
});
