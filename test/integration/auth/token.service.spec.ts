import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import {
  initializeTransactionalContext,
  StorageDriver,
} from 'typeorm-transactional';
import { getTestMysqlModule } from '../../utils/get-test-mysql.module';
import { ConfigModule, ConfigType } from '@nestjs/config';
import tokenConfig from '@config/token.config';
import redisConfig from '@config/redis.config';
import emailConfig from '@config/email.config';
import { TokenService } from '../../../src/modules/token/application/services/token.service';
import { AccessTokenPayload } from '../../../src/modules/auth/domain/types/jwt-payload';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { IllegalArgumentException } from '@common/exceptions/illegal-argument.exception';
import { TOKEN_REPOSITORY } from '@common/constants/dependency-token';
import { TokenRepository } from '../../../src/modules/auth/domain/repositories/token.repository';
import appConfig from '@config/app.config';
import { TokenRedisRepository } from '../../../src/modules/auth/infrastructure/persistence/token-redis.repository';
import { TestRedisModule } from '../../utils/get-test-redis.module';

describe('TokenService', () => {
  let tokenService: TokenService;
  let jwtService: JwtService;
  let jwtConfig: ConfigType<typeof tokenConfig>;
  let tokenRepository: TokenRepository;
  let moduleRef: TestingModule;
  let dataSource: DataSource;

  beforeAll(async () => {
    initializeTransactionalContext({ storageDriver: StorageDriver.AUTO });

    moduleRef = await Test.createTestingModule({
      imports: [
        getTestMysqlModule(),
        TestRedisModule,
        ConfigModule.forRoot({
          isGlobal: true,
          load: [tokenConfig, redisConfig, emailConfig, appConfig],
        }),
        JwtModule.register({}),
      ],
      providers: [
        TokenService,
        {
          provide: TOKEN_REPOSITORY,
          useClass: TokenRedisRepository,
        },
      ],
    }).compile();
    await moduleRef.init();

    tokenService = moduleRef.get(TokenService);
    jwtService = moduleRef.get(JwtService);
    tokenRepository = moduleRef.get(TOKEN_REPOSITORY);
    jwtConfig = moduleRef.get(tokenConfig.KEY);
    dataSource = moduleRef.get(DataSource);
  });

  afterAll(async () => {
    await dataSource.destroy();
    await moduleRef.close();
  });

  describe('getUserByRefreshToken', () => {
    it('리프레시 토큰으로 사용자 ID를 찾습니다.', async () => {
      // given
      const refreshToken = tokenService.generateRefreshToken();
      await tokenRepository.saveRefreshToken(refreshToken, 1, 1000);

      // when
      const result = await tokenService.getUserIdByRefreshToken(refreshToken);

      // then
      expect(result).toBe(1);
    });

    it('유효하지 않은 리프레시 토큰으로 사용자 ID를 찾으면 에러가 발생합니다.', async () => {
      // given
      const refreshToken = 'invalid';

      // when
      const result = tokenService.getUserIdByRefreshToken(refreshToken);

      // then
      await expect(result).rejects.toThrow(IllegalArgumentException);
    });
  });

  describe('getEmailByEmailVerificationToken', () => {
    it('이메일 인증 토큰으로 이메일을 찾습니다.', async () => {
      // given
      const emailVerificationToken =
        tokenService.generateEmailVerificationCode();
      await tokenRepository.saveEmailVerificationCode(
        emailVerificationToken,
        'test@example.com',
        1000,
      );

      // when
      const result = await tokenService.getEmailByEmailVerificationCode(
        emailVerificationToken,
      );

      // then
      expect(result).toBe('test@example.com');
    });

    it('유효하지 않은 이메일 인증 토큰으로 이메일을 찾으면 에러가 발생합니다.', async () => {
      // given
      const emailVerificationToken = 'invalid';

      // when
      const result = tokenService.getEmailByEmailVerificationCode(
        emailVerificationToken,
      );

      // then
      await expect(result).rejects.toThrow(IllegalArgumentException);
    });
  });

  describe('generateAccessToken', () => {
    it('엑세스 토큰을 생성합니다.', async () => {
      // given
      const payload = {
        sub: '1',
        username: 'test',
        roles: ['user'],
      };

      // when
      const result = tokenService.generateAccessToken(payload);

      // then
      expect(result).toBeDefined();

      const decoded: AccessTokenPayload = jwtService.verify(result, {
        secret: jwtConfig.accessToken.secret,
      });
      expect(decoded).toMatchObject(payload);
    });
  });

  describe('generateRefreshToken', () => {
    it('리프레시 토큰을 생성합니다.', async () => {
      // when
      const result = tokenService.generateRefreshToken();

      // then
      expect(result).toBeDefined();
    });
  });

  describe('generateEmailVerificationToken', () => {
    it('이메일 인증 토큰을 생성합니다.', async () => {
      // when
      const result = tokenService.generateEmailVerificationCode();

      // then
      expect(result).toBeDefined();
      expect(result).toHaveLength(6);
    });
  });

  describe('saveRefreshToken', () => {
    it('리프레시 토큰을 저장합니다.', async () => {
      // given
      const userId = 1;
      const refreshToken = tokenService.generateRefreshToken();

      // when
      await tokenService.saveRefreshToken(refreshToken, userId);

      // then
      const storedUserId =
        await tokenRepository.findUserIdByRefreshToken(refreshToken);
      expect(storedUserId).toBe(1);
    });
  });

  describe('saveEmailVerificationToken', () => {
    it('이메일 인증 토큰을 저장합니다.', async () => {
      // given
      const email = 'test@example.com';
      const emailVerificationToken =
        tokenService.generateEmailVerificationCode();

      // when
      await tokenService.saveEmailVerificationCode(
        email,
        emailVerificationToken,
      );

      // then
      const storedEmail =
        await tokenRepository.findEmailByEmailVerificationCode(
          emailVerificationToken,
        );
      expect(storedEmail).toBe(email);
    });
  });

  describe('revokeRefreshToken', () => {
    it('리프레시 토큰을 폐기합니다.', async () => {
      // given
      const refreshToken = tokenService.generateRefreshToken();
      await tokenRepository.saveRefreshToken(refreshToken, 1, 1000);

      // when
      await tokenService.revokeRefreshToken(refreshToken);

      // then
      const result =
        await tokenRepository.findUserIdByRefreshToken(refreshToken);
      expect(result).toBeNull();
    });
  });

  describe('revokeEmailVerificationToken', () => {
    it('이메일 인증 토큰을 폐기합니다.', async () => {
      // given
      const emailVerificationToken =
        tokenService.generateEmailVerificationCode();
      await tokenRepository.saveEmailVerificationCode(
        emailVerificationToken,
        'test@example.com',
        1000,
      );

      // when
      await tokenService.revokeEmailVerificationCode(emailVerificationToken);

      // then
      const result = await tokenRepository.findEmailByEmailVerificationCode(
        emailVerificationToken,
      );
      expect(result).toBeNull();
    });
  });
});
