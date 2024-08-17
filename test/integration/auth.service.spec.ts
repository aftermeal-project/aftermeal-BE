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
import { LoginResponseDto } from '../../src/modules/auth/presentation/dto/login-response.dto';

describe('AuthService', () => {
  // System Under Test
  let authService: AuthService;

  // Dependencies
  let userRepository: Repository<User>;
  let roleRepository: Repository<Role>;
  let dataSource: DataSource;
  let moduleRef: TestingModule;

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

    authService = moduleRef.get(AuthService);
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
      const actual: LoginResponseDto = await authService.login(email, password);

      // then
      expect(actual.accessToken).toBeDefined();
      expect(actual.expiredIn).toBeDefined();
      expect(actual.tokenType).toBeDefined();
      expect(actual.refreshToken).toBeDefined();
    });
  });
});
