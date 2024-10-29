import { DataSource } from 'typeorm';
import { Test } from '@nestjs/testing';
import { User } from '../../../src/modules/user/domain/entities/user.entity';
import { Role } from '../../../src/modules/role/domain/entities/role.entity';
import { getTestMysqlModule } from '../../utils/get-test-mysql.module';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { AuthService } from '../../../src/modules/auth/application/services/auth.service';
import {
  initializeTransactionalContext,
  StorageDriver,
} from 'typeorm-transactional';
import jwtConfig from '@config/token.config';
import redisConfig from '@config/redis.config';
import redisConfiguration from '@config/redis.config';
import { LoginResponseDto } from '../../../src/modules/auth/presentation/dto/login-response.dto';
import { TokenRefreshResponseDto } from '../../../src/modules/auth/presentation/dto/token-refresh-response.dto';
import { generateRandomString } from '@common/utils/generate-random-string';
import {
  REDIS_CLIENT,
  ROLE_REPOSITORY,
  TOKEN_REPOSITORY,
  USER_REPOSITORY,
} from '@common/constants/dependency-token';
import { TokenRepository } from '../../../src/modules/auth/domain/repositories/token.repository';
import { UserRepository } from '../../../src/modules/user/domain/repositories/user.repository';
import { RoleRepository } from '../../../src/modules/role/domain/repositories/role.repository';
import { TokenRedisRepository } from '../../../src/modules/auth/infrastructure/persistence/token-redis.repository';
import { createClient, RedisClientType } from 'redis';
import { TokenService } from '../../../src/modules/token/application/services/token.service';
import { UserModule } from '../../../src/modules/user/user.module';
import { RoleModule } from '../../../src/modules/role/role.module';
import { JwtModule } from '@nestjs/jwt';

describe('AuthService', () => {
  let authService: AuthService;
  let userRepository: UserRepository;
  let roleRepository: RoleRepository;
  let refreshTokenRepository: TokenRepository;
  let dataSource: DataSource;
  let redisClient: RedisClientType;

  beforeAll(async () => {
    initializeTransactionalContext({ storageDriver: StorageDriver.AUTO });

    const moduleRef = await Test.createTestingModule({
      imports: [
        getTestMysqlModule(),
        ConfigModule.forRoot({
          load: [jwtConfig, redisConfig],
          isGlobal: true,
        }),
        JwtModule.register({ global: true }),
        UserModule,
        RoleModule,
      ],
      providers: [
        AuthService,
        TokenService,
        {
          provide: TOKEN_REPOSITORY,
          useClass: TokenRedisRepository,
        },
        {
          provide: REDIS_CLIENT,
          useFactory: async (
            redisConfig: ConfigType<typeof redisConfiguration>,
          ) => {
            return await createClient({
              url: `redis://:${redisConfig.password}@${redisConfig.host}:${redisConfig.port}`,
            })
              .on('error', () => {
                console.error('Redis connection failed');
              })
              .connect();
          },
          inject: [redisConfiguration.KEY],
        },
      ],
    }).compile();

    authService = moduleRef.get<AuthService>(AuthService);
    userRepository = moduleRef.get<UserRepository>(USER_REPOSITORY);
    roleRepository = moduleRef.get<RoleRepository>(ROLE_REPOSITORY);
    refreshTokenRepository = moduleRef.get<TokenRepository>(TOKEN_REPOSITORY);
    redisClient = moduleRef.get<RedisClientType>(REDIS_CLIENT);
    dataSource = moduleRef.get<DataSource>(DataSource);
  });

  afterEach(async () => {
    await roleRepository.deleteAll();
    await userRepository.deleteAll();
    await refreshTokenRepository.deleteAll();
  });

  afterAll(async () => {
    await dataSource.destroy();
    await redisClient.disconnect();
  });

  describe('login', () => {
    it('유효한 정보를 통해 인증한다.', async () => {
      // given
      const role: Role = Role.create('USER');
      await roleRepository.save(role);

      const user: User = User.createTeacher(
        '송유현',
        'test@example.com',
        role,
        'G$K9Vss9-wNX6jOvY',
      );
      await user.hashPassword();
      await userRepository.save(user);

      // when
      const result: LoginResponseDto = await authService.login(
        'test@example.com',
        'G$K9Vss9-wNX6jOvY',
      );

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

      const user: User = User.createTeacher(
        '송유현',
        'test@example.com',
        role,
        'G$K9Vss9-wNX6jOvY',
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
