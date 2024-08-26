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
import { TokenRefreshResponseDto } from '../../src/modules/auth/presentation/dto/token-refresh-response.dto';
import { generateRandomString } from '@common/utils/src/generate-random-string';
import { REFRESH_TOKEN_REPOSITORY } from '@common/constants';
import { RefreshTokenRepository } from '../../src/modules/auth/domain/refresh-token.repository';

describe('AuthService', () => {
  let authService: AuthService;
  let userRepository: Repository<User>;
  let roleRepository: Repository<Role>;
  let refreshTokenRepository: RefreshTokenRepository;
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
    refreshTokenRepository = moduleRef.get(REFRESH_TOKEN_REPOSITORY);
    dataSource = moduleRef.get(DataSource);
  });

  afterEach(async () => {
    await roleRepository.delete({});
    await userRepository.delete({});
    await refreshTokenRepository.deleteAll();
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
      const result: LoginResponseDto = await authService.login(email, password);

      // then
      expect(result.accessToken).toBeDefined();
      expect(result.expiredIn).toBeDefined();
      expect(result.tokenType).toBeDefined();
      expect(result.refreshToken).toBeDefined();
    });
  });

  describe('refresh', () => {
    it('유효한 토큰을 통해 갱신한다.', async () => {
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

      const refreshToken: string = generateRandomString(30);
      await refreshTokenRepository.save(refreshToken, user.id, 30);

      // when
      const result: TokenRefreshResponseDto =
        await authService.refresh(refreshToken);

      // then
      expect(result.accessToken).toBeDefined();
      expect(result.expiredIn).toBeDefined();
      expect(result.tokenType).toBeDefined();
      expect(result.refreshToken).toBeDefined();
    });
  });
});
